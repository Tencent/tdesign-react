import React, { useRef, useImperativeHandle, useEffect } from 'react';
import classNames from 'classnames';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import noop from '../_util/noop';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import FormContext from './FormContext';
import FormItem from './FormItem';
import FormList from './FormList';
import { formDefaultProps } from './defaultProps';
import useForm, { HOOK_MARK } from './hooks/useForm';
import useInstance from './hooks/useInstance';
import useWatch from './hooks/useWatch';

import type { StyledProps } from '../common';
import type { TdFormProps } from './type';

export interface FormProps extends TdFormProps, StyledProps {
  children?: React.ReactNode;
}

const Form = forwardRefWithStatics(
  (originalProps: FormProps, ref) => {
    const { classPrefix, form: globalFormConfig } = useConfig();
    const props = useDefaultProps<FormProps>(originalProps, formDefaultProps);
    const {
      style,
      className,
      labelWidth,
      statusIcon,
      labelAlign,
      layout,
      colon,
      initialData,
      requiredMark = globalFormConfig.requiredMark,
      requiredMarkPosition = globalFormConfig.requiredMarkPosition,
      scrollToFirstError,
      showErrorMessage,
      resetType,
      rules,
      errorMessage = globalFormConfig.errorMessage,
      disabled,
      readonly,
      children,
      id,
      onReset,
      onValuesChange = noop,
    } = props;

    const formClass = classNames(`${classPrefix}-form`, className, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const [form] = useForm(props.form); // 内部与外部共享 form 实例，外部不传则内部创建
    const formRef = useRef<HTMLFormElement>(null);
    const formMapRef = useRef(new Map()); // 收集所有包含 name 属性 formItem 实例
    const floatingFormDataRef = useRef({}); // 储存游离值的 formData
    const formInstance = useInstance(props, formRef, formMapRef, floatingFormDataRef);

    useImperativeHandle(ref, () => formInstance);
    Object.assign(form, { ...formInstance });
    form?.getInternalHooks?.(HOOK_MARK)?.setForm?.(formInstance);

    // form 初始化后清空队列
    useEffect(() => {
      form?.getInternalHooks?.(HOOK_MARK)?.flashQueue?.();
    }, [form]);

    function onResetHandler(e: React.FormEvent<HTMLFormElement>) {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current.resetField();
      });
      form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.([]);
      form.store = {};
      onReset?.({ e });
    }

    function onFormItemValueChange(changedValue: Record<string, unknown>) {
      const allFields = formInstance.getFieldsValue(true);
      onValuesChange(changedValue, allFields);
    }

    return (
      <FormContext.Provider
        value={{
          form,
          labelWidth,
          statusIcon,
          labelAlign,
          layout,
          colon,
          initialData,
          requiredMark,
          requiredMarkPosition,
          errorMessage,
          showErrorMessage,
          scrollToFirstError,
          resetType,
          rules,
          disabled,
          readonly,
          formMapRef,
          floatingFormDataRef,
          onFormItemValueChange,
        }}
      >
        <form
          ref={formRef}
          id={id}
          style={style}
          className={formClass}
          onSubmit={formInstance.submit}
          onReset={onResetHandler}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
  { useForm, useWatch, FormItem, FormList },
);

Form.displayName = 'Form';

export default Form;
