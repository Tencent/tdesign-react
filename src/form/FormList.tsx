import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import merge from 'lodash/merge';
import get from 'lodash/get';
import { FormListContext, useFormContext } from './FormContext';
import { FormItemInstance } from './FormItem';
import { TdFormListProps, FormListFieldOperation, FormListField } from './type';
import { calcFieldValue } from './utils';
import log from '../_common/js/log';

let key = 0;

const FormList = (props: TdFormListProps) => {
  const { formMapRef } = useFormContext();
  const { name, initialData = [], rules, children } = props;

  const [initialValue, setInitialValue] = useState(initialData);
  const [fields, setFields] = useState<Array<FormListField>>(
    initialData.map((data, index) => ({
      key: (key += 1),
      name: index,
      isListField: true,
      ...data,
    })),
  );
  const formListMapRef = useRef(new Map()); // 收集 formItem 实例
  const formListRef = useRef<FormItemInstance>(); // 当前 formList 实例

  const operation: FormListFieldOperation = {
    add(defaultValue?: any, insertIndex?: number) {
      const cloneFields = [...fields];
      const index = insertIndex ?? cloneFields.length;
      cloneFields.splice(index, 0, {
        key: (key += 1),
        name: index,
        isListField: true,
      });
      cloneFields.forEach((field, index) => Object.assign(field, { name: index }));
      setFields(cloneFields);

      if (typeof defaultValue !== 'undefined') {
        const nextInitialValue = [...initialValue];
        nextInitialValue[index] = defaultValue;
        setInitialValue(nextInitialValue);
      }
    },
    remove(index: number | number[]) {
      const nextFields = fields
        .filter((_, i) => {
          if (Array.isArray(index)) return !index.includes(i);
          return i !== index;
        })
        .map((field, index) => Object.assign(field, { name: index }));

      setInitialValue(initialValue.filter((_, idx) => idx !== index));
      setFields(nextFields);
    },
    move(from: number, to: number) {
      const cloneFields = [...fields];
      const fromItem = { ...cloneFields[from] };
      const toItem = { ...cloneFields[to] };
      cloneFields[to] = fromItem;
      cloneFields[from] = toItem;
      setFields(cloneFields);
    },
  };

  // 外部设置 fields 优先级最高，可以更改渲染的节点
  function setListFields(fieldData: any[], callback: Function) {
    setFields(
      fieldData.map((_, index) => ({
        key: (key += 1),
        name: index,
        isListField: true,
      })),
    );
    // 延迟至 FormItem 渲染后再赋值
    requestAnimationFrame(() => {
      [...formListMapRef.current.values()].forEach((formItemRef) => {
        const { name } = formItemRef.current;
        const data = get(fieldData, name);
        callback(formItemRef, data);
      });
    });
  }

  useEffect(() => {
    [...formListMapRef.current.values()].forEach((formItemRef) => {
      const { name, value } = formItemRef.current;
      if (value) return;

      const data = get(initialValue, name);
      formItemRef.current.setField({ value: data, status: 'not' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, initialValue]);

  useEffect(() => {
    if (!name || !formMapRef) return;
    formMapRef.current.set(name, formListRef);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      formMapRef.current.delete(name);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useImperativeHandle(
    formListRef,
    (): FormItemInstance => ({
      name,
      getValue() {
        const formListValue = [];
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          const { name, getValue } = formItemRef.current;
          const fieldValue = calcFieldValue(name, getValue());
          merge(formListValue, fieldValue);
        });
        return formListValue;
      },
      validate: (trigger = 'all') => {
        const resultList = [];
        const validates = [...formListMapRef.current.values()].map((formItemRef) =>
          formItemRef.current.validate(trigger),
        );
        return new Promise((resolve) => {
          Promise.all(validates).then((validateResult) => {
            validateResult.forEach((result) => {
              const errorKey = Object.keys(result)[0];
              const errorKeyList = errorKey.split(',');

              let errorValue = Object.values(result)[0];
              errorValue = calcFieldValue(errorKeyList, errorValue);

              merge(resultList, errorValue);
            });
            const errorItems = validateResult.filter((item) => Object.values(item)[0] !== true);
            if (errorItems.length) {
              resolve({ [String(name)]: resultList });
            } else {
              resolve({ [String(name)]: true });
            }
          });
        });
      },
      setValue: (fieldData: any[]) => {
        setListFields(fieldData, (formItemRef, data) => {
          formItemRef?.current?.setValue(data);
        });
      },
      setField: (fieldData: { value?: any[]; status?: string }) => {
        const { value, status } = fieldData;
        setListFields(value, (formItemRef, data) => {
          formItemRef?.current?.setField({ value: data, status });
        });
      },
      resetField: () => {
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          formItemRef.current.resetField();
        });
        setInitialValue([]);
      },
      setValidateMessage: (fieldData) => {
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          const { name } = formItemRef.current;
          const data = get(fieldData, name);

          formItemRef.current.setValidateMessage(data);
        });
      },
      resetValidate: () => {
        [...formListMapRef.current.values()].forEach((formItemRef) => {
          formItemRef.current.resetValidate();
        });
      },
    }),
  );

  if (typeof children !== 'function') {
    log.error('Form', `FormList's children must be a function!`);
    return null;
  }

  return (
    <FormListContext.Provider value={{ name, rules, formListMapRef }}>
      {children(fields, operation)}
    </FormListContext.Provider>
  );
};

FormList.displayName = 'FormList';

export default FormList;
