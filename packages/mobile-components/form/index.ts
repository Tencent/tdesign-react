import './style/index.js';

import _Form from './Form';
import _FormItem from './FormItem';

import type { TdFormItemProps, TdFormProps } from './type';

export * from './hooks/interface';
export * from './type';
export type FormProps = TdFormProps;
export type FormItemProps = TdFormItemProps;

export const Form = _Form;
export const FormItem = _FormItem;
export default Form;
