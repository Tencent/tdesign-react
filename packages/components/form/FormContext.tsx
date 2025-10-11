import React from 'react';
import { TdFormProps, TdFormListProps, NamePath } from './type';
import { FormItemInstance } from './FormItem';
import { InternalFormInstance } from './hooks/interface';

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
