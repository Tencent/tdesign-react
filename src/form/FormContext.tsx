import React from 'react';
import { TdFormProps, TdFormListProps } from './type';
import { FormItemInstance } from './FormItem';

const FormContext = React.createContext<{
  labelWidth?: TdFormProps['labelWidth'];
  statusIcon?: TdFormProps['statusIcon'];
  labelAlign: TdFormProps['labelAlign'];
  layout: TdFormProps['layout'];
  colon: TdFormProps['colon'];
  requiredMark: TdFormProps['requiredMark'];
  scrollToFirstError: TdFormProps['scrollToFirstError'];
  showErrorMessage: TdFormProps['showErrorMessage'];
  resetType: TdFormProps['resetType'];
  disabled: TdFormProps['disabled'];
  rules: TdFormProps['rules'];
  errorMessage: TdFormProps['errorMessage'];
  formMapRef: React.RefObject<Map<any, React.RefObject<FormItemInstance>>>;
  onFormItemValueChange: (changedValue: Record<string, unknown>) => void;
}>({
  labelWidth: '100px',
  labelAlign: 'right',
  layout: 'vertical',
  colon: false,
  requiredMark: true,
  scrollToFirstError: undefined,
  showErrorMessage: true,
  resetType: 'empty',
  disabled: false,
  rules: undefined,
  errorMessage: undefined,
  statusIcon: false,
  onFormItemValueChange: undefined,
  formMapRef: undefined,
});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;

export const FormListContext = React.createContext<{
  name: string | number;
  rules: TdFormListProps['rules'];
  formListMapRef: React.RefObject<Map<any, React.RefObject<FormItemInstance>>>;
}>({
  name: undefined,
  rules: undefined,
  formListMapRef: undefined,
});

export const useFormListContext = () => React.useContext(FormListContext);
