import React, { Ref } from 'react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check, { CheckProps } from '../check';
import { CheckboxGroup } from './CheckboxGroup';

export interface CheckboxProps extends Omit<CheckProps, 'type'> {}

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: Ref<HTMLLabelElement>) => <Check ref={ref} type="checkbox" {...props} />,
  // statics
  {
    Group: CheckboxGroup,
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
