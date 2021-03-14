import React, { forwardRef } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import FormContext from './FormContext';
import { TdFormProps } from './FormProps';

const Form: React.FC<TdFormProps> = forwardRef((props, ref: React.Ref<HTMLFormElement>) => {
  const {
    form,
    className,
    labelWidth,
    statusIcon,
    labelAlign = 'right',
    layout = 'vertical',
    size = 'medium',
    colon = false,
    requiredMark = true,
    scrollToFirstError = '',
    showErrorMessage = true,
    children,
  } = props;
  const { classPrefix } = useConfig();
  const formClass = classNames(className, {
    [`${classPrefix}-form-inline`]: layout === 'inline',
    [`${classPrefix}-form`]: layout !== 'inline',
  });

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
      <form className={formClass} ref={ref}>
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;
