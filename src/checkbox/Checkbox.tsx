import React, { Ref } from 'react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check, { CheckProps } from '../common/Check';
import { CheckboxGroup } from './CheckboxGroup';

export interface CheckboxProps extends Omit<CheckProps, 'type'> {}

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: Ref<HTMLLabelElement>) => <Check ref={ref} type="checkbox" {...props} />,
  { Group: CheckboxGroup },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
