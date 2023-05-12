import React from 'react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check, { CheckProps } from '../common/Check';
import CheckboxGroup from './CheckboxGroup';
import { checkboxDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export type CheckboxProps = Omit<CheckProps, 'type'>;

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: React.Ref<HTMLLabelElement>) => (
    <Check ref={ref} type="checkbox" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
  ),
  { Group: CheckboxGroup },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
