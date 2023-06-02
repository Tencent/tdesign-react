import React, { useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import type { TdFormProps } from './type';
import useInstance from './hooks/useInstance';
import useForm, { HOOK_MARK } from './hooks/useForm';
import useWatch from './hooks/useWatch';
import { StyledProps } from '../common';
import FormContext from './FormContext';
import FormItem from './FormItem';
import FormList from './FormList';
import { formDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

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
      scrollToFirstError,
      showErrorMessage,
      resetType,
      rules,
      errorMessage = globalFormConfig.errorMessage,
      preventSubmitDefault,
      disabled,
      children,
      onReset,
      onValuesChange = noop,
    } = props;

    const formClass = classNames(`${classPrefix}-form`, className, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const [form] = useForm(props.form); // 内部与外部共享 form 实例，外部不传则内部创建
    const formRef = useRef<HTMLFormElement>();
    const formMapRef = useRef(new Map()); // 收集所有包含 name 属性 formItem 实例
    const formInstance = useInstance(props, formRef, formMapRef);

    useImperativeHandle(ref, () => formInstance);
    Object.assign(form, { ...formInstance });
    form?.getInternalHooks?.(HOOK_MARK)?.setForm?.(formInstance);

    // form 初始化后清空队列
    React.useEffect(() => {
      form?.getInternalHooks?.(HOOK_MARK)?.flashQueue?.();
    }, [form]);

    function onResetHandler(e: React.FormEvent<HTMLFormElement>) {
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current.resetField();
      });
      form?.getInternalHooks?.(HOOK_MARK)?.notifyWatch?.([]);
      onReset?.({ e });
    }

    function onFormItemValueChange(changedValue: Record<string, unknown>) {
      const allFields = formInstance.getFieldsValue(true);
      onValuesChange(changedValue, allFields);
    }

    function onKeyDownHandler(e: React.KeyboardEvent<HTMLFormElement>) {
      // 禁用 input 输入框回车自动提交 form
      if ((e.target as Element).tagName.toLowerCase() !== 'input') return;
      if (preventSubmitDefault && e.key === 'Enter') {
        e.preventDefault?.();
        e.stopPropagation?.();
      }
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
          errorMessage,
          showErrorMessage,
          scrollToFirstError,
          resetType,
          rules,
          disabled,
          formMapRef,
          onFormItemValueChange,
        }}
      >
        <form
          ref={formRef}
          style={style}
          className={formClass}
          onSubmit={formInstance.submit}
          onReset={onResetHandler}
          onKeyDown={onKeyDownHandler}
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
