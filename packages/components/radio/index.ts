import './style/index.js';

import _Radio from './Radio';

export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './RadioGroup';
export * from './type';

export const Radio = _Radio;
export const RadioGroup = _Radio.Group;

export default Radio;
