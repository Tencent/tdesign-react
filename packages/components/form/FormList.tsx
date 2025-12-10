import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { castArray, cloneDeep, get, isEqual, merge, set, unset } from 'lodash-es';

import log from '@tdesign/common-js/log/index';
import { FormListContext, useFormContext, useFormListContext } from './FormContext';
import { HOOK_MARK } from './hooks/useForm';
import { calcFieldValue, concatName, convertNameToArray, swap } from './utils';

import type { FormItemInstance } from './FormItem';
import type { FormListField, FormListFieldOperation, NamePath, TdFormListProps } from './type';

let globalKey = 0;

const FormList: React.FC<TdFormListProps> = (props) => {
  const { name, rules, children } = props;

  const {
    formMapRef,
    form,
    onFormItemValueChange,
    initialData: initialDataFromForm,
    resetType: resetTypeFromContext,
  } = useFormContext();
  const { fullPath: parentFullPath, initialData: parentInitialData } = useFormListContext();

  const fullPath = concatName(parentFullPath, name);

  const initialData = useMemo(() => {
    let propsInitialData;
    if (props.initialData) {
      propsInitialData = props.initialData;
    } else if (parentFullPath && parentInitialData) {
      const relativePath = fullPath.slice(convertNameToArray(parentFullPath).length);
      propsInitialData = get(parentInitialData, relativePath);
    } else {
      propsInitialData = get(initialDataFromForm, fullPath);
    }
    return cloneDeep(propsInitialData);
  }, [fullPath, parentFullPath, initialDataFromForm, parentInitialData, props.initialData]);

  const [formListValue, setFormListValue] = useState(() => {
    const value = get(form?.store, fullPath) || initialData || [];
    if (value.length && !get(form?.store, fullPath)) {
      set(form?.store, fullPath, value);
    }
    return value;
  });

  const [fields, setFields] = useState<FormListField[]>(() =>
    formListValue.map((data, index) => ({
      data: { ...data },
      key: (globalKey += 1),
      name: index,
      isListField: true,
    })),
  );

  // 暴露给 Form 的当前 FormList 实例
  const formListRef = useRef<FormItemInstance>(null);
  // 存储当前 FormList 下所有的 FormItem 实例
  const formListMapRef = useRef<Map<NamePath, React.RefObject<FormItemInstance>>>(new Map());

  const snakeName = []
    .concat(name)
    .filter((item) => item !== undefined)
    .toString(); // 转化 name

  const updateFormList = (newFields: any, newFormListValue: any) => {
    setFields(newFields);
    setFormListValue(newFormListValue);
    set(form?.store, fullPath, newFormListValue);
    const changeValue = calcFieldValue(fullPath, newFormListValue);
    onFormItemValueChange?.(changeValue);
  };

  const operation: FormListFieldOperation = {
    add(defaultValue?: any, insertIndex?: number) {
      const newFields = [...fields];
      const index = insertIndex ?? newFields.length;
      newFields.splice(index, 0, {
        key: (globalKey += 1),
        name: index,
        isListField: true,
      });
      const newFormListValue = [...formListValue];
      newFormListValue.splice(index, 0, cloneDeep(defaultValue));
      updateFormList(newFields, newFormListValue);
    },
    remove(index: number | number[]) {
      const indices = castArray(index);
      const newFields = [...fields].filter((f) => !indices.includes(f.name)).map((field, i) => ({ ...field, name: i }));
      const newFormListValue = [...formListValue].filter((_, i) => !indices.includes(i));
      unset(form?.store, fullPath);
      updateFormList(newFields, newFormListValue);
    },
    move(from: number, to: number) {
      const newFields = [...fields];
      const newFormListValue = [...formListValue];
      swap(newFields, from, to);
      swap(newFormListValue, from, to);
      newFields[from].name = from;
      newFields[to].name = to;
      updateFormList(newFields, newFormListValue);
    },
  };

  function setListFields(fieldData: any[], callback: Function) {
    if (isEqual(formListValue, fieldData)) return;

    const newFields = fieldData.map((_, index) => {
      const currField = fields[index];
      const oldItem = formListValue[index];
      const newItem = fieldData[index];
      const noChange = currField && isEqual(oldItem, newItem);
      return {
        key: noChange ? currField.key : (globalKey += 1),
        name: index,
        isListField: true,
      };
    });

    Array.from(formListMapRef.current.values()).forEach((formItemRef) => {
      if (!formItemRef.current) return;
      const { name: childName } = formItemRef.current;
      const data = get(fieldData, childName);
      if (data !== undefined) callback(formItemRef, data);
    });

    updateFormList(newFields, fieldData);
  }

  useEffect(() => {
    if (!name || !formMapRef) return;
    formMapRef.current.set(fullPath, formListRef);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formMapRef.current.delete(fullPath);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakeName]);

  useEffect(() => {
    // fields 变化通知 watch 事件
    form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, snakeName, fields]);

  useImperativeHandle(
    formListRef,
    (): FormItemInstance => ({
      name,
      fullPath,
      value: formListValue,
      initialData,
      isFormList: true,
      formListMapRef,
      getValue: () => get(form?.store, fullPath),
      validate: (trigger = 'all') => {
        const resultList = [];
        const validates = [...formListMapRef.current.values()].map((formItemRef) =>
          formItemRef?.current?.validate?.(trigger),
        );
        return new Promise((resolve) => {
          Promise.all(validates).then((validateResult) => {
            validateResult.forEach((result) => {
              if (typeof result !== 'object') return;
              const errorValue = Object.values(result)[0];
              merge(resultList, errorValue);
            });
            const errorItems = validateResult.filter((item) => {
              if (typeof item !== 'object') return;
              return Object.values(item)[0] !== true;
            });
            if (errorItems.length) {
              resolve({ [snakeName]: resultList });
            } else {
              resolve({ [snakeName]: true });
            }
          });
        });
      },
      // TODO 支持局部更新数据
      setValue: (fieldData) => {
        setListFields(fieldData, (formItemRef, data) => {
          formItemRef?.current?.setValue?.(data);
        });
      },
      setField: (fieldData) => {
        const { value, status } = fieldData;
        const currentValue = get(form?.store, fullPath) || [];
        if (isEqual(currentValue, value)) return;
        setListFields(value, (formItemRef, data) => {
          formItemRef?.current?.setField?.({ value: data, status });
        });
      },
      resetField: (type) => {
        const resetType = type || resetTypeFromContext;
        if (resetType === 'initial') {
          const currentData = get(form?.store, fullPath);
          const data = initialData || [];
          if (isEqual(currentData, initialData)) return;
          setFormListValue(data);
          const newFields = data?.map((data, index) => ({
            data: { ...data },
            key: (globalKey += 1),
            name: index,
            isListField: true,
          }));
          setFields(newFields);
          set(form?.store, fullPath, data);
        } else {
          // 重置为空
          setFormListValue([]);
          setFields([]);
          unset(form?.store, fullPath);
        }
      },
      setValidateMessage: (fieldData) => {
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          if (!formItemRef.current) return;

          const { name } = formItemRef.current;
          const data = get(fieldData, name);

          formItemRef?.current?.setValidateMessage?.(data);
        });
      },
      resetValidate: () => {
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          formItemRef?.current?.resetValidate?.();
        });
      },
    }),
  );

  if (typeof children !== 'function') {
    log.error('Form', `FormList's children must be a function!`);
    return null;
  }

  return (
    <FormListContext.Provider
      value={{
        name,
        fullPath,
        rules,
        formListMapRef,
        initialData,
        form,
      }}
    >
      {children(fields, operation)}
    </FormListContext.Provider>
  );
};

FormList.displayName = 'FormList';

export default FormList;
