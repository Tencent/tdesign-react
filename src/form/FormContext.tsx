import React from 'react';
import { TdFormProps } from './FormProps';

const FormContext = React.createContext<{
  labelWidth?: TdFormProps['labelWidth'];
  statusIcon?: TdFormProps['statusIcon'];
  labelAlign: TdFormProps['labelAlign'];
  layout: TdFormProps['layout'];
  size: TdFormProps['size'];
  colon: TdFormProps['colon'];
  requiredMark: TdFormProps['requiredMark'];
  scrollToFirstError: TdFormProps['scrollToFirstError'];
  showErrorMessage: TdFormProps['showErrorMessage'];
}>({
  labelAlign: 'right',
  layout: 'vertical',
  size: 'medium',
  colon: false,
  requiredMark: true,
  scrollToFirstError: '',
  showErrorMessage: true,
});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;
