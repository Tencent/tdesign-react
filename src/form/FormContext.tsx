import React from 'react';
import { TdFormProps } from './type';

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
  disabled: TdFormProps['disabled'];
  rules: TdFormProps['rules'];
  validateMessage: TdFormProps['validateMessage'];
  formItemsRef: React.RefObject<Array<React.RefObject<HTMLElement>>>;
  onFormItemValueChange: (changedValue: Record<string, unknown>) => void;
}>({
  labelWidth: 'calc(1 / 12 * 100%)',
  labelAlign: 'right',
  layout: 'vertical',
  size: 'medium',
  colon: false,
  requiredMark: true,
  scrollToFirstError: undefined,
  showErrorMessage: true,
  resetType: 'empty',
  disabled: false,
  rules: undefined,
  validateMessage: {},
  statusIcon: false,
  onFormItemValueChange: undefined,
  formItemsRef: null,
});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;
