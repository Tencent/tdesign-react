import React from 'react';
import type { FormItemInstance } from './FormItem';
import type { InternalFormInstance } from './hooks/interface';
import type { NamePath, TdFormListProps, TdFormProps } from './type';

const FormContext = React.createContext<{
  form?: InternalFormInstance;
  labelWidth?: TdFormProps['labelWidth'];
  statusIcon?: TdFormProps['statusIcon'];
  labelAlign: TdFormProps['labelAlign'];
  layout: TdFormProps['layout'];
  colon: TdFormProps['colon'];
  initialData: TdFormProps['initialData'];
  requiredMark: TdFormProps['requiredMark'];
  requiredMarkPosition: TdFormProps['requiredMarkPosition'];
  scrollToFirstError: TdFormProps['scrollToFirstError'];
  showErrorMessage: TdFormProps['showErrorMessage'];
  resetType: TdFormProps['resetType'];
  disabled: TdFormProps['disabled'];
  readOnly: TdFormProps['readOnly'];
  rules: TdFormProps['rules'];
  errorMessage: TdFormProps['errorMessage'];
  formMapRef: React.RefObject<Map<any, React.RefObject<FormItemInstance>>>;
  floatingFormDataRef: React.RefObject<Record<any, any>>;
  onFormItemValueChange: (changedValue: Record<string, unknown>) => void;
}>({
  form: undefined,
  labelWidth: '100px',
  labelAlign: 'right',
  layout: 'vertical',
  colon: false,
  initialData: {},
  requiredMark: undefined,
  requiredMarkPosition: undefined,
  scrollToFirstError: undefined,
  showErrorMessage: undefined,
  resetType: 'empty',
  disabled: undefined,
  readOnly: undefined,
  rules: undefined,
  errorMessage: undefined,
  statusIcon: undefined,
  onFormItemValueChange: undefined,
  formMapRef: undefined,
  floatingFormDataRef: undefined,
});

export const useFormContext = () => React.useContext(FormContext);

export default FormContext;

export const FormListContext = React.createContext<{
  name: NamePath;
  rules: TdFormListProps['rules'];
  formListMapRef: React.RefObject<Map<any, React.RefObject<FormItemInstance>>>;
  initialData: TdFormListProps['initialData'];
  form?: InternalFormInstance;
}>({
  name: undefined,
  rules: undefined,
  formListMapRef: undefined,
  initialData: [],
  form: undefined,
});

export const useFormListContext = () => React.useContext(FormListContext);
