import React, { useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import noop from '../_util/noop';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import type { TdFormProps, FormInstanceFunctions } from './type';
import useInstance from './hooks/useInstance';
import { StyledProps } from '../common';
import FormContext from './FormContext';
import FormItem from './FormItem';

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
      size = 'medium',
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

    const formClass = classNames(className, `${classPrefix}-form`, {
      [`${classPrefix}-form-inline`]: layout === 'inline',
    });

    const formRef: React.RefObject<HTMLFormElement> = useRef();
    const formItemsRef = useRef([]);

    const {
      submit,
      reset,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      setFields,
      validate,
      clearValidate,
      setValidateMessage,
    } = useInstance(props, formRef, formItemsRef);

    useImperativeHandle(ref as FormRefInterface, () => ({
      currentElement: formRef.current,
      submit,
      reset,
      getFieldValue,
      getFieldsValue,
      setFieldsValue,
      setFields,
      validate,
      clearValidate,
      setValidateMessage,
    }));

    function onResetHandler(e: React.FormEvent<HTMLFormElement>) {
      if (preventSubmitDefault) {
        e.preventDefault?.();
        e.stopPropagation?.();
      }
      formItemsRef.current.forEach(({ current: formItemRef }) => {
        formItemRef && formItemRef?.resetField();
      });
      onReset?.({ e });
    }

    function onFormItemValueChange(changedValue: Record<string, unknown>) {
      const allFields = getFieldsValue(true);
      onValuesChange(changedValue, allFields);
    }

    function onKeyDownHandler(e: React.KeyboardEvent<HTMLFormElement>) {
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
          size,
          colon,
          requiredMark,
          errorMessage,
          showErrorMessage,
          scrollToFirstError,
          resetType,
          rules,
          disabled,
          formItemsRef,
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
  { FormItem },
);

Form.displayName = 'Form';

export default Form;
