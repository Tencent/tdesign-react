import React, { forwardRef } from 'react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check from '../common/Check';
import useDefaultProps from '../hooks/useDefaultProps';
import CheckboxGroup from './CheckboxGroup';
import { checkboxDefaultProps } from './defaultProps';

import type { CheckProps } from '../common/Check';

export type CheckboxProps = Omit<CheckProps, 'type'>;

const CheckboxButton = forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => (
  <Check ref={ref} type="checkbox-button" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
));
CheckboxButton.displayName = 'CheckboxButton';

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: React.Ref<HTMLLabelElement>) => (
    <Check ref={ref} type="checkbox" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
  ),
  { Group: CheckboxGroup, Button: CheckboxButton },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
