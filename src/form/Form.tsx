import React, { useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import type { TdFormProps, FormInstanceFunctions } from './type';
import useInstance from './hooks/useInstance';
import { StyledProps } from '../common';
import FormContext from './FormContext';
import FormItem from './FormItem';
import FormList from './FormList';
import { formDefaultProps } from './defaultProps';

export interface FormProps extends TdFormProps, StyledProps {
  children?: React.ReactNode;
}

export interface FormRefInterface extends React.RefObject<unknown>, FormInstanceFunctions {
  currentElement: HTMLFormElement;
}

const Form = forwardRefWithStatics(
  (props: FormProps, ref) => {
    const { classPrefix, form: globalFormConfig } = useConfig();

    const {
      style,
      className,
      labelWidth = '100px',
      statusIcon,
      labelAlign = 'right',
      layout = 'vertical',
      colon = false,
      requiredMark = globalFormConfig.requiredMark,
      scrollToFirstError,
      showErrorMessage = true,
      resetType = 'empty',
      rules,
      errorMessage = globalFormConfig.errorMessage,
      preventSubmitDefault = true,
      disabled,
      children,
      onReset,
      onValuesChange = noop,
    } = props;

    const formClass = classNames(`${classPrefix}-form`, className, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const formRef: React.RefObject<HTMLFormElement> = useRef();
    const formMapRef = useRef(new Map()); // 收集所有 formItem 实例

    const {
      submit,
      reset,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      setFields,
      validate,
      validateOnly,
      clearValidate,
      setValidateMessage,
    } = useInstance(props, formRef, formMapRef);

    useImperativeHandle(ref as FormRefInterface, () => ({
      currentElement: formRef.current,
      submit,
      reset,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      setFields,
      validate,
      validateOnly,
      clearValidate,
      setValidateMessage,
    }));

    function onResetHandler(e: React.FormEvent<HTMLFormElement>) {
      if (preventSubmitDefault) {
        e.preventDefault?.();
        e.stopPropagation?.();
      }
      [...formMapRef.current.values()].forEach((formItemRef) => {
        formItemRef?.current.resetField();
      });
      onReset?.({ e });
    }

    function onFormItemValueChange(changedValue: Record<string, unknown>) {
      const allFields = getFieldsValue(true);
      onValuesChange(changedValue, allFields);
    }

    function onKeyDownHandler(e: React.KeyboardEvent<HTMLFormElement>) {
      if ((e.target as Element).tagName.toLowerCase() === 'textarea') return;
      if (preventSubmitDefault && e.key === 'Enter') {
        e.preventDefault?.();
        e.stopPropagation?.();
      }
    }

    return (
      <FormContext.Provider
        value={{
          labelWidth,
          statusIcon,
          labelAlign,
          layout,
          colon,
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
          onSubmit={submit}
          onReset={onResetHandler}
          onKeyDown={onKeyDownHandler}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
  { FormItem, FormList },
);

Form.displayName = 'Form';
Form.defaultProps = formDefaultProps;

export default Form;
