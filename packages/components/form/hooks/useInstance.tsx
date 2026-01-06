import { cloneDeep, get, isEmpty, isFunction, merge, set } from 'lodash-es';
import log from '@tdesign/common-js/log/index';
import useConfig from '../../hooks/useConfig';
import { calcFieldValue, findFormItem, objectToArray, travelMapFromObject } from '../utils';

import type { FormItemInstance } from '../FormItem';
import type {
  AllValidateResult,
  FormResetParams,
  FormValidateMessage,
  FormValidateResult,
  NamePath,
  TdFormProps,
} from '../type';
import type { InternalFormInstance } from './interface';

// 检测是否需要校验 默认全量校验
function needValidate(name: NamePath, fields: string[]) {
  if (!fields || !Array.isArray(fields)) return true;
  return fields.some((item) => String(item) === String(name));
}

// 整理校验结果
function formatValidateResult(validateResultList) {
  const result = validateResultList.reduce((r, err) => Object.assign(r || {}, err), {});
  Object.keys(result).forEach((key) => {
    if (result[key] === true) {
      delete result[key];
    } else {
      result[key] = result[key].filter((fr: AllValidateResult) => fr.result === false);
    }

    // 整理嵌套数据
    if (result[key] && key.includes(',')) {
      const keyList = key.split(',');
      const fieldValue = calcFieldValue(keyList, result[key]);
      merge(result, fieldValue);
      delete result[key];
    }
  });
  return isEmpty(result) ? true : result;
}

export default function useInstance(
  props: TdFormProps,
  formRef: React.RefObject<HTMLFormElement>,
  formMapRef: React.MutableRefObject<Map<any, any>>,
  floatingFormDataRef: React.MutableRefObject<Record<any, any>>,
  form: InternalFormInstance,
) {
  const { classPrefix } = useConfig();

  const { scrollToFirstError, preventSubmitDefault = true, onSubmit, onReset } = props;

  // 获取第一个错误表单
  function getFirstError(r: FormValidateResult<FormData>) {
    if (r === true) return;
    const [firstKey] = Object.keys(r);
    if (scrollToFirstError) {
      scrollTo(`.${classPrefix}-form--has-error`);
    }
    return r[firstKey][0]?.message;
  }

  // 校验不通过时，滚动到第一个错误表单
  function scrollTo(selector: string) {
    const dom = formRef.current.querySelector?.(selector);
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
      const fields = getFieldsValue(true);
      onSubmit?.({ validateResult: r, firstError, e, fields });
    });
  }

  // 对外方法，该方法会触发全部表单组件错误信息显示
  async function validate(param?: Record<string, any>): Promise<FormValidateResult<FormData>> {
    const { fields, trigger = 'all', showErrorMessage } = param || {};
    const list = [...formMapRef.current.values()]
      .filter(
        (formItemRef) => isFunction(formItemRef?.current?.validate) && needValidate(formItemRef?.current?.name, fields),
      )
      .map((formItemRef) => formItemRef?.current.validate(trigger, showErrorMessage));

    const validateList = await Promise.all(list);
    return formatValidateResult(validateList);
  }

  // 对外方法，该方法只会校验不会触发信息提示
  async function validateOnly(param?: Record<string, any>): Promise<FormValidateResult<FormData>> {
    const { fields, trigger = 'all' } = param || {};
    const list = [...formMapRef.current.values()]
      .filter(
        (formItemRef) =>
          isFunction(formItemRef?.current?.validateOnly) && needValidate(formItemRef?.current?.name, fields),
      )
      .map((formItemRef) => formItemRef?.current.validateOnly?.(trigger));

    const validateList = await Promise.all(list);
    return formatValidateResult(validateList);
  }

  // 对外方法，获取对应 formItem 的值
  function getFieldValue(name: NamePath) {
    if (!name) return null;
    const formItemRef = findFormItem(name, formMapRef);
    if (formItemRef?.current) {
      return formItemRef.current.getValue?.();
    }
    return get(floatingFormDataRef.current, name);
  }

  // 对外方法，获取一组字段名对应的值，当调用 getFieldsValue(true) 时返回所有值
  function getFieldsValue(nameList: string[] | boolean) {
    const fieldsValue: Record<string, any> = {};

    const processField = (name: string, formItemRef: any) => {
      if (!formItemRef?.current) return;
      const { getValue } = formItemRef.current;
      const value = getValue?.();
      const fieldValue = calcFieldValue(name, value, !props.supportNumberKey);
      merge(fieldsValue, fieldValue);
    };

    if (nameList === true) {
      // 嵌套数组子节点先添加，导致外层数据被覆盖，因而需要倒序遍历
      const entries = Array.from(formMapRef.current.entries());
      for (let i = entries.length - 1; i >= 0; i--) {
        const [name, formItemRef] = entries[i];
        processField(name, formItemRef);
      }
      // 即使没有对应的 FormItem 渲染，也返回数据，用于支持动态 set 的场景
      merge(fieldsValue, cloneDeep(floatingFormDataRef.current));
    } else {
      if (!Array.isArray(nameList)) {
        log.error('Form', 'The parameter of "getFieldsValue" must be an array');
        return {};
      }
      for (let i = 0; i < nameList.length; i++) {
        const name = nameList[i];
        const formItemRef = findFormItem(name, formMapRef);
        if (formItemRef?.current) {
          processField(name, formItemRef);
        } else {
          const floatingValue = get(floatingFormDataRef.current, name);
          if (floatingValue !== undefined) {
            const fieldValue = calcFieldValue(name, floatingValue, !props.supportNumberKey);
            merge(fieldsValue, fieldValue);
          }
        }
      }
    }
    return cloneDeep(fieldsValue);
  }

  // 对外方法，设置对应 formItem 的值
  function setFieldsValue(fields = {}) {
    const nameLists = objectToArray(fields);
    nameLists.forEach((nameList) => {
      const fieldValue = get(fields, nameList);
      const formItemRef = findFormItem(nameList, formMapRef);
      if (formItemRef?.current) {
        formItemRef.current.setValue?.(fieldValue);
      } else {
        set(floatingFormDataRef.current, nameList, fieldValue);
        // 同时写入 form.store，确保 store 始终包含所有被 set 的字段
        set(form?.store, nameList, fieldValue);
      }
    });
  }

  // 对外方法，设置对应 formItem 的数据
  function setFields(fields = []) {
    if (!Array.isArray(fields)) throw new TypeError('The parameter of "setFields" must be an array');

    fields.forEach((field) => {
      const { name, ...restFields } = field;
      const formItemRef = findFormItem(name, formMapRef);
      formItemRef?.current?.setField(restFields);
    });
  }

  // 对外方法，重置对应 formItem 的数据
  function reset(params: FormResetParams<FormData>) {
    if (typeof params === 'undefined') {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetField();
      });
    } else {
      const { type = 'initial', fields = [] } = params;
      fields.forEach((name) => {
        const formItemRef = findFormItem(name, formMapRef);
        formItemRef?.current?.resetField(type);
      });
    }
    onReset?.({});
    requestAnimationFrame(() => {
      const fieldValue = getFieldsValue(true);
      props.onValuesChange?.(fieldValue, fieldValue);
    });
  }

  // 对外方法，重置对应 formItem 的状态
  function clearValidate(fields?: Array<keyof FormData>) {
    // reset all
    if (typeof fields === 'undefined') {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetValidate();
      });
    } else {
      if (!Array.isArray(fields)) throw new TypeError('The parameter of "clearValidate" must be an array');
      fields.forEach((name) => {
        const formItemRef = findFormItem(name, formMapRef);
        formItemRef?.current?.resetValidate();
      });
    }
  }

  // 对外方法，设置 formItem 的错误信息
  function setValidateMessage(message: FormValidateMessage<FormData>) {
    travelMapFromObject(message, formMapRef, (formItemRef, fieldValue) => {
      formItemRef?.current?.setValidateMessage?.(fieldValue);
    });
  }

  // 对外方法，获取 formItem 的错误信息
  function getValidateMessage(fields?: Array<keyof FormData>) {
    if (typeof fields !== 'undefined' && !Array.isArray(fields)) {
      throw new TypeError('The parameter of "getValidateMessage" must be an array');
    }

    const formItemRefs =
      typeof fields === 'undefined'
        ? [...formMapRef.current.values()]
        : fields
            .map((name) => {
              const formItemRef = findFormItem(name, formMapRef);
              return formItemRef;
            })
            .filter(Boolean);

    const extractValidateMessage = (formItemRef: React.RefObject<FormItemInstance>) => {
      const item = formItemRef?.current?.getValidateMessage?.();
      if (isEmpty(item)) return null;
      const nameKey = formItemRef?.current?.name;
      return { nameKey, item };
    };

    const message: Record<string, any> = {};

    formItemRefs.forEach((formItemRef) => {
      const result = extractValidateMessage(formItemRef);
      if (!result) return;
      const key = Array.isArray(result.nameKey)
        ? result.nameKey.toString() // 将 数组 [a,b] 转为 a,b 作为 key
        : String(result.nameKey);
      message[key] = result.item;
    });

    if (isEmpty(message)) return;

    return message;
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
    currentElement: formRef.current,
    getCurrentElement: () => formRef.current,
  };
}
