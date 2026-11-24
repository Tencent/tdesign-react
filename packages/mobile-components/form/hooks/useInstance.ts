import React from 'react';
import { cloneDeep, get, isArray, isBoolean, isEmpty, isFunction, isObject, merge, set } from 'lodash-es';

import type {
  FormResetParams,
  FormValidateMessage,
  FormValidateParams,
  FormValidateResult,
  NamePath,
  TdFormProps,
  FieldData,
} from '../type';
import type { InternalFormInstance } from './interface';

// 检测是否需要校验 默认全量校验
function needValidate(name: NamePath, fields?: string[]) {
  if (!fields || !Array.isArray(fields)) return true;
  return fields.some((item) => String(item) === String(name));
}

// 整理校验结果
function formatValidateResult(validateResultList: any[]) {
  const result = validateResultList.reduce((r, err) => Object.assign(r || {}, err), {});
  Object.keys(result).forEach((key) => {
    if (result[key] === true) {
      delete result[key];
    }
  });
  return isEmpty(result) ? true : result;
}

export default function useInstance(
  props: TdFormProps & { onSubmit?: any; onValidate?: any; onReset?: any; onValuesChange?: any },
  formRef: React.RefObject<HTMLFormElement>,
  formMapRef: React.MutableRefObject<Map<any, any>>,
  floatingFormDataRef: React.MutableRefObject<Record<any, any>>,
  form: InternalFormInstance,
  classPrefix: string,
) {
  const { scrollToFirstError, onSubmit: onSubmitCustom, onValidate, onReset: onResetCustom, onValuesChange } = props;

  // 获取第一个错误表单
  function getFirstError(result: FormValidateResult<any>) {
    if (isBoolean(result)) {
      return '';
    }
    const keys = Object.keys(result);
    const [firstKey] = keys;
    if (scrollToFirstError && firstKey) {
      scrollTo(`.${classPrefix}-form-item__${firstKey}`);
    }
    const resArr = result[firstKey];
    if (!isArray(resArr)) {
      return '';
    }
    return resArr?.[0]?.message || '';
  }

  // 校验不通过时，滚动到第一个错误表单
  function scrollTo(selector: string) {
    const dom = formRef.current?.querySelector?.(selector);
    const behavior = scrollToFirstError as ScrollBehavior;
    if (behavior && dom) {
      dom.scrollIntoView({ behavior });
    }
  }

  // 对外方法，获取单个字段值
  function getFieldValue(name: NamePath) {
    if (!name) return null;
    const formItemRef = formMapRef.current.get(String(name));
    if (formItemRef?.current) {
      return formItemRef.current.getValue?.();
    }
    return get(floatingFormDataRef.current, name) ?? get(form?.store, name);
  }

  // 对外方法，获取一组字段名对应的值，当调用 getFieldsValue(true) 时返回所有值
  function getFieldsValue(nameList: string[] | boolean) {
    const fieldsValue: Record<string, any> = {};

    if (nameList === true) {
      // 先用 floatingFormDataRef 作为基础
      merge(fieldsValue, cloneDeep(floatingFormDataRef.current));

      // 倒序遍历，嵌套数组子节点先添加，导致外层数据被覆盖
      const entries = Array.from(formMapRef.current.entries());
      for (let i = entries.length - 1; i >= 0; i--) {
        const [name, formItemRef] = entries[i];
        if (formItemRef?.current) {
          const value = formItemRef.current.getValue?.();
          set(fieldsValue, name, value);
        }
      }
      // 合并 store 中的值
      merge(fieldsValue, cloneDeep(form?.store));
    } else {
      if (!Array.isArray(nameList)) {
        console.error('Form', 'The parameter of "getFieldsValue" must be an array');
        return {};
      }
      for (let i = 0; i < nameList.length; i++) {
        const name = nameList[i];
        const formItemRef = formMapRef.current.get(String(name));
        if (formItemRef?.current) {
          const value = formItemRef.current.getValue?.();
          set(fieldsValue, name, value);
        } else {
          const floatingValue = get(floatingFormDataRef.current, name);
          if (typeof floatingValue !== 'undefined') {
            set(fieldsValue, name, floatingValue);
          } else {
            const storeValue = get(form?.store, name);
            set(fieldsValue, name, storeValue);
          }
        }
      }
    }
    return cloneDeep(fieldsValue);
  }

  // 递归处理嵌套对象，将叶子节点设置到对应的 FormItem
  function setNestedValue(obj: Record<string, unknown>, prefix = '') {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const fullPath = prefix ? `${prefix}.${key}` : key;

      if (isObject(value) && !Array.isArray(value)) {
        setNestedValue(value as Record<string, unknown>, fullPath);
      } else {
        const formItemRef = formMapRef.current.get(fullPath);
        if (formItemRef?.current) {
          formItemRef.current.setValue?.(cloneDeep(value));
        } else {
          // 没有对应 FormItem 时，存到 floatingFormDataRef
          set(floatingFormDataRef.current, fullPath, value);
          if (form?.store) {
            set(form.store, fullPath, value);
          }
        }
      }
    });
  }

  // 对外方法，设置表单字段值
  function setFieldsValue(fields: Record<string, unknown> = {}) {
    setNestedValue(fields);
  }

  // 对外方法，设置多组字段状态
  function setFields(fields: FieldData[] = []) {
    if (!Array.isArray(fields)) throw new TypeError('The parameter of "setFields" must be an array');

    fields.forEach((field) => {
      const { name, ...restFields } = field;
      const formItemRef = formMapRef.current.get(String(name));
      formItemRef?.current?.setField?.(restFields);
    });
  }

  // 对外方法，校验函数
  async function validate(param?: FormValidateParams): Promise<FormValidateResult<any>> {
    const { fields, trigger = 'all', showErrorMessage } = param || {};
    const list = [...formMapRef.current.values()]
      .filter(
        (formItemRef) => isFunction(formItemRef?.current?.validate) && needValidate(formItemRef?.current?.name, fields),
      )
      .map((formItemRef) => formItemRef?.current?.validate(trigger, showErrorMessage));
    const arr = await Promise.all(list);
    const result = formatValidateResult(arr);
    onValidate?.({
      validateResult: result,
    });
    return result;
  }

  // 对外方法，纯净校验函数
  async function validateOnly(params?: Omit<FormValidateParams, 'showErrorMessage'>): Promise<FormValidateResult<any>> {
    const { fields, trigger = 'all' } = params || {};
    const list = [...formMapRef.current.values()]
      .filter(
        (formItemRef) =>
          isFunction(formItemRef?.current?.validateOnly) && needValidate(formItemRef?.current?.name, fields),
      )
      .map((formItemRef) => formItemRef?.current?.validateOnly?.(trigger));
    const arr = await Promise.all(list);
    return formatValidateResult(arr);
  }

  // 对外方法，手动提交表单
  function submit(params?: { showErrorMessage?: boolean }) {
    validate(params ? { showErrorMessage: params.showErrorMessage } : undefined).then((r) => {
      const firstError = getFirstError(r);
      onSubmitCustom?.({
        validateResult: r,
        firstError,
      });
    });
  }

  // 对外方法，重置对应 formItem 的数据
  function reset(params?: FormResetParams<any>) {
    if (typeof params === 'undefined') {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetField?.();
      });
    } else {
      const { type, fields = [] } = params;
      [...formMapRef.current.values()].forEach((formItemRef) => {
        if (isFunction(formItemRef?.current?.resetField)) {
          const name = formItemRef?.current?.name;
          if (needValidate(name, fields as string[])) {
            formItemRef?.current?.resetField(type);
          }
        }
      });
    }
    // 重置后清空 store 和 floatingFormData
    if (form?.store) {
      // eslint-disable-next-line no-param-reassign
      form.store = {};
    }
    // eslint-disable-next-line no-param-reassign
    floatingFormDataRef.current = {};
    onResetCustom?.({});
    requestAnimationFrame(() => {
      const fieldValue = getFieldsValue(true);
      onValuesChange?.(fieldValue, fieldValue);
    });
  }

  // 对外方法，清除校验结果
  function clearValidate(fields?: Array<string>) {
    [...formMapRef.current.values()].forEach((formItemRef) => {
      if (isFunction(formItemRef?.current?.resetValidate) && needValidate(formItemRef?.current?.name, fields)) {
        formItemRef?.current?.resetValidate();
      }
    });
  }

  // 对外方法，设置 formItem 的错误信息
  function setValidateMessage(validateMessage: FormValidateMessage<any>) {
    const keys = Object.keys(validateMessage);
    if (!keys.length) return;

    [...formMapRef.current.values()].forEach((formItemRef) => {
      const name = formItemRef?.current?.name;
      if (isFunction(formItemRef?.current?.setValidateMessage) && name) {
        const nameKey = Array.isArray(name) ? name.toString() : String(name);
        if (keys.includes(nameKey)) {
          const msg = validateMessage[nameKey];
          formItemRef?.current?.setValidateMessage(msg);
        }
      }
    });
  }

  // 对外方法，获取 formItem 的错误信息
  function getValidateMessage(fields?: Array<string>) {
    if (typeof fields !== 'undefined' && !isArray(fields)) {
      throw new TypeError('The parameter of "getValidateMessage" must be an array');
    }

    const formItemRefs =
      typeof fields === 'undefined'
        ? [...formMapRef.current.values()]
        : fields.map((name) => formMapRef.current.get(String(name))).filter(Boolean);

    const message: Record<string, any> = {};

    formItemRefs.forEach((formItemRef: any) => {
      const item = formItemRef?.current?.getValidateMessage?.();
      if (isEmpty(item)) return;
      const nameKey = formItemRef?.current?.name;
      const key = Array.isArray(nameKey) ? nameKey.toString() : String(nameKey);
      message[key] = item;
    });

    if (isEmpty(message)) return;

    return message;
  }

  // 表单字段值变化回调
  function onFormItemValueChange(changedValue: Record<string, unknown>) {
    requestAnimationFrame(() => {
      const allFields = getFieldsValue(true);
      onValuesChange?.(changedValue, allFields);
    });
  }

  return {
    submit,
    reset,
    validate,
    validateOnly,
    clearValidate,
    setFields,
    setFieldsValue,
    setValidateMessage,
    getValidateMessage,
    getFieldValue,
    getFieldsValue,
    onFormItemValueChange,
    currentElement: () => formRef.current!,
    getCurrentElement: () => formRef.current!,
  };
}
