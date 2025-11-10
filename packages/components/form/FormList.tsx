import log from '@tdesign/common-js/log/index';
import { cloneDeep, get, isEqual, merge, set, unset } from 'lodash-es';
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { FormListContext, useFormContext, useFormListContext } from './FormContext';
import { HOOK_MARK } from './hooks/useForm';
import { calcFieldValue, concatNamePath, normalizeNamePath } from './utils';

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

  const fullPath = useMemo(() => {
    const normalizedName = normalizeNamePath(name);
    const normalizedParentPath = normalizeNamePath(parentFullPath);
    // 如果没有父路径，直接使用 name
    if (!parentFullPath || normalizedParentPath.length === 0) {
      return normalizedName;
    }
    // 检查 name 是否已经包含了完整的父路径
    // 兼容场景：https://github.com/Tencent/tdesign-react/issues/3843
    const isAbsolutePath = normalizedParentPath.every((segment, index) => normalizedName[index] === segment);
    if (isAbsolutePath) return normalizedName;
    // 如果是相对路径，与父路径拼接
    return concatNamePath(parentFullPath, name);
  }, [parentFullPath, name]);

  const initialData = useMemo(() => {
    let propsInitialData;
    if (props.initialData) {
      propsInitialData = props.initialData;
    } else if (parentFullPath && parentInitialData) {
      const relativePath = fullPath.slice(normalizeNamePath(parentFullPath).length);
      propsInitialData = get(parentInitialData, relativePath);
    } else {
      propsInitialData = get(initialDataFromForm, fullPath);
    }
    return propsInitialData;
  }, [fullPath, parentFullPath, initialDataFromForm, parentInitialData, props.initialData]);

  const [formListValue, setFormListValue] = useState(() => get(form?.store, fullPath) || initialData || []);
  const [fields, setFields] = useState<FormListField[]>(() =>
    formListValue?.map((data, index) => ({
      data: { ...data },
      key: (globalKey += 1),
      name: index,
      isListField: true,
    })),
  );

  const formListMapRef = useRef<Map<NamePath, React.RefObject<FormItemInstance>>>(new Map());
  const formListRef = useRef<FormItemInstance>(null);

  const snakeName = []
    .concat(name)
    .filter((item) => item !== undefined)
    .toString(); // 转化 name

  const isMounted = useRef(false);

  const buildDefaultFieldMap = () => {
    if (formListMapRef.current.size <= 0) return {};
    const defaultValues: Record<string, any> = {};
    formListMapRef.current.forEach((_, itemPath) => {
      const itemPathArray = normalizeNamePath(itemPath);
      if (itemPathArray.length !== normalizeNamePath(fullPath).length + 2) return;
      const fieldName = itemPathArray[itemPathArray.length - 1];
      // add 没有传参时，构建一个包含所有子字段名称的对象，用 undefined 作为值，仅用于占位，确保回调给用户的数据结构完整
      defaultValues[fieldName] = undefined;
    });
    return defaultValues;
  };

  const operation: FormListFieldOperation = {
    add(defaultValue?: any, insertIndex?: number) {
      const cloneFields = [...fields];
      const index = insertIndex ?? cloneFields.length;
      cloneFields.splice(index, 0, {
        key: (globalKey += 1),
        name: index,
        isListField: true,
      });
      cloneFields.forEach((field, index) => Object.assign(field, { name: index }));
      setFields(cloneFields);

      const nextFormListValue = cloneDeep(formListValue);

      let finalValue = defaultValue;
      if (finalValue === undefined) {
        finalValue = buildDefaultFieldMap();
      }
      if (finalValue) {
        nextFormListValue?.splice(index, 0, cloneDeep(finalValue));
        setFormListValue(nextFormListValue);
      }

      set(form?.store, fullPath, nextFormListValue);
      const newPath = [...normalizeNamePath(fullPath), index];
      const fieldValue = calcFieldValue(newPath, finalValue);
      onFormItemValueChange?.(fieldValue);
    },
    remove(index: number | number[]) {
      const indices = Array.isArray(index) ? index : [index];

      const nextFields = fields
        .filter((item) => !indices.includes(item.name))
        .map((field, i) => ({ ...field, name: i }));
      setFields(nextFields);

      const nextFormListValue = cloneDeep(formListValue).filter((_, idx) => !indices.includes(idx));
      setFormListValue(nextFormListValue);
      if (nextFormListValue.length) {
        set(form?.store, fullPath, nextFormListValue);
      }
      const fieldValue = calcFieldValue(fullPath, nextFormListValue);
      onFormItemValueChange?.(fieldValue);
    },
    move(from: number, to: number) {
      const cloneFields = [...fields];
      const fromItem = { ...cloneFields[from] };
      const toItem = { ...cloneFields[to] };
      cloneFields[to] = fromItem;
      cloneFields[from] = toItem;
      set(form?.store, fullPath, []);
      setFields(cloneFields);
    },
  };

  const handleFieldUpdateTasks = (fieldData: any[], callback: Function) => {
    Array.from(formListMapRef.current.values()).forEach((formItemRef) => {
      if (!formItemRef.current) return;
      const { name: childName } = formItemRef.current;
      const data = get(fieldData, childName);
      if (data !== undefined) callback(formItemRef, data);
    });
    const fieldValue = calcFieldValue(fullPath, fieldData);
    onFormItemValueChange?.(fieldValue);
  };

  function setListFields(fieldData: any[], callback: Function) {
    const currList = get(form?.store, fullPath) || [];
    if (isEqual(currList, fieldData)) return;

    const newFields = fieldData.map((_, index) => {
      const currField = fields[index];
      const oldItem = currList[index];
      const newItem = fieldData[index];
      const noChange = currField && isEqual(oldItem, newItem);
      return {
        key: noChange ? currField.key : (globalKey += 1),
        name: index,
        isListField: true,
      };
    });

    setFields(newFields);
    set(form?.store, fullPath, fieldData);
    handleFieldUpdateTasks(fieldData, callback);
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
    [...formListMapRef.current.values()].forEach((formItemRef) => {
      if (!formItemRef.current) return;
      const { name, isUpdated } = formItemRef.current;
      if (isUpdated) return; // 内部更新过值则跳过

      const data = get(formListValue, name);
      formItemRef.current.setField({ value: data, status: 'not' });
    });
  }, [formListValue]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    // fields 变化通知 watch 事件
    form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, snakeName, fields]);

  useImperativeHandle(
    formListRef,
    (): FormItemInstance => ({
      name,
      fullPath,
      isFormList: true,
      formListMapRef,
      getValue() {
        const formListValue = [];
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          if (!formItemRef.current) return;

          const { name, getValue } = formItemRef.current;
          const fieldValue = calcFieldValue(name, getValue());
          merge(formListValue, fieldValue);
        });
        return formListValue;
      },
      validate: (trigger = 'all') => {
        const resultList = [];
        const validates = [...formListMapRef.current.values()].map((formItemRef) =>
          formItemRef?.current?.validate?.(trigger),
        );
        return new Promise((resolve) => {
          Promise.all(validates).then((validateResult) => {
            validateResult.forEach((result) => {
              const errorValue = Object.values(result)[0];
              merge(resultList, errorValue);
            });
            const errorItems = validateResult.filter((item) => Object.values(item)[0] !== true);
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
          const data = cloneDeep(initialData) || [];
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
          formListMapRef.current.clear();
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
