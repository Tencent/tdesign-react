import React from 'react';
import { TdFormProps } from '../_type/components/form';

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
  resetType: TdFormProps['resetType'];
  rules: TdFormProps['rules'];
}>({
  labelAlign: 'right',
  layout: 'vertical',
  size: 'medium',
  colon: false,
  requiredMark: true,
  scrollToFirstError: undefined,
  showErrorMessage: true,
  resetType: 'empty',
  rules: undefined,
  statusIcon: false,
});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;
