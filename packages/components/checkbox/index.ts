import './style/index.js';

import _Checkbox from './Checkbox';
import _CheckboxGroup from './CheckboxGroup';

export type { CheckboxProps } from './Checkbox';
export type { CheckboxGroupProps } from './CheckboxGroup';
export * from './type';

export const Checkbox = _Checkbox;
export const CheckboxGroup = _CheckboxGroup;
export default Checkbox;
