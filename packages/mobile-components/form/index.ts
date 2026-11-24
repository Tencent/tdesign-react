import _Form from './Form';
import _FormItem from './FormItem';
import { TdFormItemProps, TdFormProps } from './type';
import './style/index.js';

export * from './type';
export * from './hooks/interface';
export type FormProps = TdFormProps;
export type FormItemProps = TdFormItemProps;

export const Form = _Form;
export const FormItem = _FormItem;
export default Form;
