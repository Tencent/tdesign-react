import React, { useRef, createRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';
import isFunction from 'lodash/isFunction';
import isBoolean from 'lodash/isBoolean';
import flatten from 'lodash/flatten';
import useConfig from '../_util/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { TdFormProps, FormValidateResult } from '../_type/components/form';
import { StyledProps } from '../_type';
import FormContext from './FormContext';
import FormItem from './FormItem';

export interface FormProps extends TdFormProps, StyledProps {
  children?: React.ReactNode;
}

export type Result = FormValidateResult<FormData>;

/**
 * 判断是否空值 布尔值、数字不为空
 * @param val
 */
function isValueEmpty(val: unknown) {
  // https://github.com/lodash/lodash/issues/496
  return isBoolean(val) || isNumber(val) ? false : isEmpty(val);
}

const Form = forwardRefWithStatics(
  (props: FormProps, ref) => {
    const {
      style,
      className,
      labelWidth = 'calc(1 / 12 * 100%)',
      statusIcon,
      labelAlign = 'right',
      layout = 'vertical',
      size = 'medium',
      colon = false,
      requiredMark = true,
      scrollToFirstError,
      showErrorMessage = true,
      resetType = 'empty',
      rules,
      children,
      onSubmit,
      onReset,
    } = props;
    const { classPrefix } = useConfig();
    const formClass = classNames(className, `${classPrefix}-form`, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const formItemsRef = useRef([]);
    formItemsRef.current = React.Children.map(children, (_child, index) => (formItemsRef.current[index] = createRef()));

    const FORM_ITEM_CLASS_PREFIX = `${classPrefix}-form-item__`;

    function getFirstError(r: Result) {
      if (r === true) return;
      const [firstKey] = Object.keys(r);
      if (scrollToFirstError) {
        scrollTo(`.${FORM_ITEM_CLASS_PREFIX + firstKey}`);
      }
      return r[firstKey][0]?.message;
    }
    // 校验不通过时，滚动到第一个错误表单
    function scrollTo(selector: string) {
      const dom = document.querySelector(selector);
      const behavior = scrollToFirstError as ScrollBehavior;
      dom && dom.scrollIntoView({ behavior });
    }

    function submitHandler(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      validate().then((r) => {
        getFirstError(r);
        onSubmit?.({ validateResult: r, e });
      });
    }
    function resetHandler(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      formItemsRef.current.forEach((formItemRef) => {
        if (!isFunction(formItemRef.resetField)) return;
        formItemRef.resetField();
      });
      onReset?.({ e });
    }

    // 对外方法，该方法会触发全部表单组件错误信息显示
    function validate(): Promise<Result> {
      const list = formItemsRef.current
        .filter((formItemRef) => isFunction(formItemRef.validate))
        .map((formItemRef) => formItemRef.validate());

      return new Promise((resolve) => {
        Promise.all(flatten(list))
          .then((arr: any) => {
            const r = arr.reduce((r, err) => Object.assign(r || {}, err), {});
            Object.keys(r).forEach((key) => {
              if (r[key] === true) {
                delete r[key];
              }
            });
            resolve(isEmpty(r) ? true : r);
          })
          .catch(console.error);
      });
    }

    // 对外方法，获取整个表单的值
    function getAllFieldsValue() {
      const fieldsValue = {};
      formItemsRef.current.forEach((formItemRef) => {
        // name 有可能为undefined。 值为空的时候，不返回（null或者undefined或者空字符串）
        if (formItemRef?.name && !isValueEmpty(formItemRef.value)) {
          fieldsValue[formItemRef.name] = formItemRef.value;
        }
      });

      return fieldsValue;
    }

    // 对外方法，获取对应 formItem 的值
    function getFieldValue(name: string) {
      if (!name) return null;
      const target = formItemsRef.current.find((formItemRef) => formItemRef.name === name);
      return target && target.value;
    }

    // 对外方法，设置对应 formItem 的值
    function setFieldsValue(fileds = {}) {
      const formItemsMap = formItemsRef.current.reduce((acc, currItem) => {
        const { name } = currItem;
        return { ...acc, [name]: currItem };
      }, {});
      Object.keys(fileds).forEach((key) => {
        formItemsMap[key]?.setValue(fileds[key]);
      });
    }

    // 对外方法，设置对应 formItem 的数据
    function setFields(fileds = []) {
      if (!Array.isArray(fileds)) throw new Error('setFields 参数需要 Array 类型');
      const formItemsMap = formItemsRef.current.reduce((acc, currItem) => {
        const { name } = currItem;
        return { ...acc, [name]: currItem };
      }, {});
      fileds.forEach((filed) => {
        const { name, value, status } = filed;
        formItemsMap[name]?.setValue(value);
        formItemsMap[name]?.setStatus(status);
      });
    }

    useImperativeHandle(ref, (): any => ({ getFieldValue, setFieldsValue, setFields, validate, getAllFieldsValue }));

    return (
      <FormContext.Provider
        value={{
          labelWidth,
          statusIcon,
          labelAlign,
          layout,
          size,
          colon,
          requiredMark,
          showErrorMessage,
          scrollToFirstError,
          resetType,
          rules,
        }}
      >
        <form className={formClass} style={style} onSubmit={submitHandler} onReset={resetHandler} ref={ref}>
          {React.Children.map(children, (child: React.ReactElement, index) => {
            const { cloneElement } = React;
            return cloneElement(child, {
              ref: (el: React.ReactElement) => {
                if (!el) return;
                formItemsRef.current[index] = el;
              },
            });
          })}
        </form>
      </FormContext.Provider>
    );
  },
  { FormItem },
);

Form.displayName = 'Form';

export default Form;
