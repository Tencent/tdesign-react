import React, { forwardRef } from 'react';
import useConfig from '../_util/useConfig';
import FormContext from './FormContext';
import { TdFormProps } from './FormProps';

const Form: React.FC<TdFormProps> = forwardRef((props, ref: React.Ref<HTMLFormElement>) => {
  const {
    form,
    className,
    style,
    labelWidth,
    statusIcon,
    labelAlign,
    layout,
    form,
    size,
    colon,
    requiredMark,
    scrollToFirstError,
    showErrorMessage,
    children,
  } = props;
  const { classPrefix } = useConfig();
  const formClassPrefix = `${classPrefix}-form`;
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
      }}
    >
      <form className={formClassPrefix} ref={ref}>
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;
