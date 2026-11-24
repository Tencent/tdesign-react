import _Radio from './Radio';
import _RadioGroup from './RadioGroup';

import './style/index.js';

export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './RadioGroup';
export * from './type';

export const Radio = _Radio;
export const RadioGroup = _RadioGroup;

export default {
  Radio,
  RadioGroup,
};
