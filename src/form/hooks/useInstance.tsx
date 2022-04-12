import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import flatten from 'lodash/flatten';
import type { TdFormProps, FormValidateResult, FormResetParams, FormValidateMessage, AllValidateResult } from '../type';
import useConfig from '../../_util/useConfig';

export default function useInstance(props: TdFormProps, formRef, formMapRef: React.MutableRefObject<Map<any, any>>) {
  const { classPrefix } = useConfig();
  const FORM_ITEM_CLASS_PREFIX = `${classPrefix}-form-item__`;

  const { scrollToFirstError, preventSubmitDefault = true, onSubmit } = props;

  // 获取第一个错误表单
  function getFirstError(r: FormValidateResult<FormData>) {
    if (r === true) return;
    const [firstKey] = Object.keys(r);
    if (scrollToFirstError) {
      scrollTo(`.${FORM_ITEM_CLASS_PREFIX + firstKey}`);
    }
    return r[firstKey][0]?.message;
  }

  // 校验不通过时，滚动到第一个错误表单
  function scrollTo(selector: string) {
    const dom = formRef.current.querySelector(selector);
    const behavior = scrollToFirstError as ScrollBehavior;
    dom && dom.scrollIntoView({ behavior });
  }

  // 对外方法 手动提交表单
  function submit(e?: React.FormEvent<HTMLFormElement>) {
    if (preventSubmitDefault) {
      e?.preventDefault?.();
      e?.stopPropagation?.();
    }
    validate().then((r) => {
      const firstError = getFirstError(r);
      onSubmit?.({ validateResult: r, firstError, e });
    });
  }

  // 对外方法，该方法会触发全部表单组件错误信息显示
  function validate(param?: Record<string, any>): Promise<FormValidateResult<FormData>> {
    function needValidate(name: string, fields: string[]) {
      if (!fields || !Array.isArray(fields)) return true;
      return fields.indexOf(name) !== -1;
    }

    const { fields, trigger = 'all' } = param || {};
    const list = [...formMapRef.current.values()]
      .filter(
        (formItemRef) => isFunction(formItemRef.current?.validate) && needValidate(formItemRef.current?.name, fields),
      )
      .map((formItemRef) => formItemRef.current?.validate(trigger));

    return new Promise((resolve) => {
      Promise.all(flatten(list))
        .then((arr: any) => {
          const r = arr.reduce((r, err) => Object.assign(r || {}, err), {});
          Object.keys(r).forEach((key) => {
            if (r[key] === true) {
              delete r[key];
            } else {
              r[key] = r[key].filter((fr: AllValidateResult) => fr.result === false);
            }
          });
          resolve(isEmpty(r) ? true : r);
        })
        .catch(console.error);
    });
  }

  // 对外方法，获取对应 formItem 的值
  function getFieldValue(name: string) {
    if (!name) return null;
    const formItemRef = formMapRef.current.get(name);
    return formItemRef.current.value;
  }

  // 对外方法，获取一组字段名对应的值，当调用 getFieldsValue(true) 时返回所有值
  function getFieldsValue(nameList: string[] | boolean) {
    const fieldsValue = {};

    if (nameList === true) {
      for (const [name, formItemRef] of formMapRef.current.entries()) {
        fieldsValue[name] = formItemRef.current.value;
      }
    } else {
      if (!Array.isArray(nameList)) throw new Error('getFieldsValue 参数需要 Array 类型');
      nameList.forEach((name) => {
        const formItemRef = formMapRef.current.get(name);
        if (formItemRef) fieldsValue[name] = formItemRef.current.value;
      });
    }
    return fieldsValue;
  }

  // 对外方法，设置对应 formItem 的值
  function setFieldsValue(fields = {}) {
    Object.keys(fields).forEach((key) => {
      const formItemRef = formMapRef.current.get(key);
      formItemRef?.current?.setValue?.(fields[key]);
    });
  }

  // 对外方法，设置对应 formItem 的数据
  function setFields(fields = []) {
    if (!Array.isArray(fields)) throw new Error('setFields 参数需要 Array 类型');

    fields.forEach((field) => {
      const { name, value, status } = field;
      const formItemRef = formMapRef.current.get(name);
      formItemRef?.current?.setField({ value, status });
    });
  }

  // 对外方法，重置对应 formItem 的数据
  function reset(params: FormResetParams) {
    // reset all
    if (typeof params === 'undefined') {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetField();
      });
    } else {
      const { type = 'initial', fields = [] } = params;

      fields.forEach((name) => {
        const formItemRef = formMapRef.current.get(name);
        formItemRef?.current?.resetField(type);
      });
    }
  }

  // 对外方法，重置对应 formItem 的状态
  function clearValidate(fields?: Array<keyof FormData>) {
    // reset all
    if (typeof fields === 'undefined') {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetValidate();
      });
    } else {
      if (!Array.isArray(fields)) throw new Error('clearValidate 参数需要 Array 类型');

      fields.forEach((name) => {
        const formItemRef = formMapRef.current.get(name);
        formItemRef.current?.resetValidate();
      });
    }
  }

  // 对外方法，设置 formItem 的错误信息
  function setValidateMessage(message: FormValidateMessage<FormData>) {
    Object.keys(message).forEach((name) => {
      const formItemRef = formMapRef.current.get(name);
      formItemRef?.current?.setValidateMessage(message[name]);
    });
  }

  return {
    submit,
    reset,
    validate,
    clearValidate,
    setFields,
    setFieldsValue,
    setValidateMessage,
    getFieldValue,
    getFieldsValue,
  };
}
