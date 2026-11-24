import React, { ForwardedRef, useEffect, useImperativeHandle, useRef, useMemo } from 'react';
import classNames from 'classnames';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { FormInstanceFunctions, TdFormProps } from './type';
import { StyledProps } from '../common';
import FormItem from './FormItem';
import { formDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import useConfig from '../hooks/useConfig';
import useForm, { HOOK_MARK } from './hooks/useForm';
import useWatch from './hooks/useWatch';
import useInstance from './hooks/useInstance';
import { FormContext } from './FormContext';

export interface FormProps extends TdFormProps, StyledProps {
  children?: React.ReactNode;
}

export const requestSubmit = (target: HTMLFormElement) => {
  if (!(target instanceof HTMLFormElement)) {
    throw new Error('target must be HTMLFormElement');
  }
  const submitter = document.createElement('input');
  submitter.type = 'submit';
  submitter.hidden = true;
  target.appendChild(submitter);
  submitter.click();
  target.removeChild(submitter);
};

const Form = forwardRefWithStatics(
  (props: FormProps, ref: ForwardedRef<FormInstanceFunctions>) => {
    const { form: globalFormConfig } = useConfig();
    const formClass = usePrefixClass('form');

    const {
      style,
      className,
      labelWidth,
      labelAlign,
      contentAlign,
      colon,
      initialData,
      requiredMark = globalFormConfig?.requiredMark,
      requiredMarkPosition = globalFormConfig?.requiredMarkPosition,
      scrollToFirstError,
      showErrorMessage,
      resetType,
      rules,
      errorMessage = globalFormConfig?.errorMessage,
      preventSubmitDefault,
      disabled,
      readonly,
      children,
      id,
      onSubmit: onSubmitCustom,
      onValidate,
      onReset: onResetCustom,
      onValuesChange = noop,
    } = useDefaultProps(props, formDefaultProps);

    const formRef = useRef<HTMLFormElement>(null);
    const formMapRef = useRef(new Map()); // 收集所有包含 name 属性 formItem 实例
    const floatingFormDataRef = useRef<Record<any, any>>({}); // 储存游离值的 formData
    const [form] = useForm(props.form); // 内部与外部共享 form 实例，外部不传则内部创建

    const formContentClass = classNames(formClass, className);

    // 使用 useInstance 获取所有实例方法（对齐桌面端架构）
    const formInstance = useInstance(
      {
        ...props,
        scrollToFirstError,
        preventSubmitDefault,
        onSubmit: onSubmitCustom,
        onValidate,
        onReset: onResetCustom,
        onValuesChange,
      },
      formRef,
      formMapRef,
      floatingFormDataRef,
      form,
      formClass,
    );

    // 关键：将实例方法同步到 form 对象上，使外部通过 form.getFieldsValue() 等可直接调用
    useImperativeHandle(ref, () => formInstance as unknown as FormInstanceFunctions);
    Object.assign(form, formInstance);
    form?.getInternalHooks?.(HOOK_MARK)?.setForm?.(formInstance);

    // form 初始化后清空队列
    useEffect(() => {
      form?.getInternalHooks?.(HOOK_MARK)?.flashQueue?.();
    }, [form]);

    // 使用 useMemo 缓存 context 值
    const formContextValue = useMemo(
      () => ({
        disabled,
        readonly,
        form,
        labelWidth,
        labelAlign,
        contentAlign,
        colon,
        initialData,
        requiredMark,
        requiredMarkPosition,
        scrollToFirstError,
        errorMessage,
        showErrorMessage,
        resetType,
        rules,
        formMapRef,
        floatingFormDataRef,
        onFormItemValueChange: formInstance.onFormItemValueChange,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        disabled,
        readonly,
        form,
        labelWidth,
        labelAlign,
        contentAlign,
        colon,
        initialData,
        requiredMark,
        requiredMarkPosition,
        scrollToFirstError,
        errorMessage,
        showErrorMessage,
        resetType,
        rules,
      ],
    );

    function onResetHandler(e?: React.FormEvent<HTMLFormElement>) {
      if (preventSubmitDefault && e) {
        e.preventDefault();
        e.stopPropagation();
      }
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current?.resetField?.();
      });
      form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.([]);
      form.store = {};
      floatingFormDataRef.current = {};
      onResetCustom?.({});
    }

    function onSubmit(e?: React.FormEvent<HTMLFormElement>) {
      if (preventSubmitDefault && e) {
        e.preventDefault();
        e.stopPropagation();
      }
      formInstance.validate().then((r) => {
        const firstError = getFirstError(r);
        onSubmitCustom?.({
          validateResult: r,
          firstError,
        });
      });
    }

    function getFirstError(result: any) {
      if (typeof result === 'boolean') {
        return '';
      }
      const keys = Object.keys(result);
      const [firstKey] = keys;
      if (scrollToFirstError && firstKey) {
        const tmpClassName = `${formClass}-item__${firstKey}`;
        const doms = formRef.current?.getElementsByClassName(tmpClassName);
        const dom = doms?.[0];
        if (dom) {
          dom.scrollIntoView({ behavior: scrollToFirstError as ScrollBehavior });
        }
      }
      const resArr = result[firstKey];
      if (!Array.isArray(resArr)) {
        return '';
      }
      return resArr?.[0]?.message || '';
    }

    return (
      <FormContext.Provider value={formContextValue}>
        <form
          ref={formRef}
          id={id}
          style={style}
          className={formContentClass}
          onSubmit={(e) => onSubmit(e)}
          onReset={(e) => onResetHandler(e)}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
  { useForm, useWatch, FormItem },
);
Form.displayName = 'Form';
export default Form;
