import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import type { TdFormProps, FormValidateResult, FormResetParams, FormValidateMessage, AllValidateResult } from '../type';
import useConfig from '../../_util/useConfig';

function getMapValue(
  name: string | number | Array<string | number>,
  formMapRef: React.MutableRefObject<Map<any, any>>,
) {
  // 提取所有 map key
  const mapKeys = [...formMapRef.current.keys()];
  // 转译为字符串后比对 key 兼容数组格式
  const key = mapKeys.find((key) => String(key) === String(name));
  // 拿到 key 引用地址获取 value
  return formMapRef.current.get(key);
}

// 通过对象数据类型获取 map 引用
function travalMapFromObject(
  obj: Record<any, any>,
  formMapRef: React.MutableRefObject<Map<any, any>>,
  callback: Function,
) {
  for (const [mapName, formItemRef] of formMapRef.current.entries()) {
    // 支持嵌套数据结构
    if (Array.isArray(mapName)) {
      // 创建唯一临时变量 symbol
      const symbol = Symbol('name');
      let fieldValue = null;

      for (let i = 0; i < mapName.length; i++) {
        const item = mapName[i];
        if (Reflect.has(fieldValue || obj, item)) {
          fieldValue = Reflect.get(fieldValue || obj, item);
        } else {
          // 当反射无法获取到值则重置为 symbol
          fieldValue = symbol;
          break;
        }
      }

      // 说明设置了值
      if (fieldValue !== symbol) {
        callback(formItemRef, fieldValue);
      }
    } else if (Reflect.has(obj, mapName)) {
      callback(formItemRef, obj[mapName]);
    }
  }
}

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

            // 整理嵌套数据
            if (r[key] && key.includes(',')) {
              const keyList = key.split(',');
              const fieldValue = keyList.reduceRight((prev, curr) => ({ [curr]: prev }), r[key]);
              merge(r, fieldValue);
              delete r[key];
            }
          });
          resolve(isEmpty(r) ? true : r);
        })
        .catch(console.error);
    });
  }

  // 对外方法，获取对应 formItem 的值
  function getFieldValue(name: string | number | Array<string | number>) {
    if (!name) return null;

    const formItemRef = getMapValue(name, formMapRef);
    return formItemRef?.current?.value;
  }

  // 对外方法，获取一组字段名对应的值，当调用 getFieldsValue(true) 时返回所有值
  function getFieldsValue(nameList: string[] | boolean) {
    const fieldsValue = {};

    if (nameList === true) {
      for (const [name, formItemRef] of formMapRef.current.entries()) {
        // 支持数组嵌套
        if (Array.isArray(name)) {
          const fieldValue = name.reduceRight((prev, curr) => ({ [curr]: prev }), formItemRef.current.value);
          merge(fieldsValue, fieldValue);
        } else {
          fieldsValue[name] = formItemRef.current.value;
        }
      }
    } else {
      if (!Array.isArray(nameList)) throw new Error('getFieldsValue 参数需要 Array 类型');

      nameList.forEach((name) => {
        const formItemRef = getMapValue(name, formMapRef);
        // 支持数组嵌套
        if (Array.isArray(name)) {
          const fieldValue = name.reduceRight((prev, curr) => ({ [curr]: prev }), formItemRef.current.value);
          merge(fieldsValue, fieldValue);
        } else {
          formItemRef && (fieldsValue[name] = formItemRef?.current?.value);
        }
      });
    }
    return fieldsValue;
  }

  // 对外方法，设置对应 formItem 的值
  function setFieldsValue(fields = {}) {
    travalMapFromObject(fields, formMapRef, (formItemRef, fieldValue) => {
      formItemRef?.current?.setValue?.(fieldValue);
    });
  }

  // 对外方法，设置对应 formItem 的数据
  function setFields(fields = []) {
    if (!Array.isArray(fields)) throw new Error('setFields 参数需要 Array 类型');

    fields.forEach((field) => {
      const { name, value, status } = field;
      const formItemRef = getMapValue(name, formMapRef);

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
        const formItemRef = getMapValue(name, formMapRef);
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
        const formItemRef = getMapValue(name, formMapRef);
        formItemRef.current?.resetValidate();
      });
    }
  }

  // 对外方法，设置 formItem 的错误信息
  function setValidateMessage(message: FormValidateMessage<FormData>) {
    travalMapFromObject(message, formMapRef, (formItemRef, fieldValue) => {
      formItemRef?.current?.setValidateMessage?.(fieldValue);
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
