import _Radio from './Radio';

import './style/index.js';

export type { RadioProps } from './Radio';
export type { RadioGroupProps } from './RadioGroup';
export * from './type';

export const Radio = _Radio;

export const RadioGroup = Radio.Group;
RadioGroup.displayName = 'RadioGroup';

export const RadioButton = Radio.Button;
RadioButton.displayName = 'RadioButton';

export default Radio;
