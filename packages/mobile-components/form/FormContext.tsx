import React, { createContext, useContext, MutableRefObject } from 'react';
import { TdFormProps } from './type';
import { FormItemInstance } from './const';
import { InternalFormInstance } from './hooks/interface';

export interface FormContextType {
  showErrorMessage?: TdFormProps['showErrorMessage'];
  labelWidth?: TdFormProps['labelWidth'];
  labelAlign?: TdFormProps['labelAlign'];
  contentAlign?: TdFormProps['contentAlign'];
  colon?: TdFormProps['colon'];
  initialData?: TdFormProps['initialData'];
  requiredMark?: TdFormProps['requiredMark'];
  requiredMarkPosition?: TdFormProps['requiredMarkPosition'];
  scrollToFirstError?: TdFormProps['scrollToFirstError'];
  rules?: TdFormProps['rules'];
  errorMessage?: TdFormProps['errorMessage'];
  resetType?: TdFormProps['resetType'];
  form?: InternalFormInstance;
  disabled?: TdFormProps['disabled'];
  readonly?: TdFormProps['readonly'];
  formMapRef?: MutableRefObject<Map<any, React.RefObject<FormItemInstance>>>;
  floatingFormDataRef?: MutableRefObject<Record<any, any>>;
  onFormItemValueChange: (changedValue: Record<string, unknown>) => void;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};
