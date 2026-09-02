import React, { forwardRef } from 'react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check from '../common/Check';
import useDefaultProps from '../hooks/useDefaultProps';
import CheckboxGroup from './CheckboxGroup';
import { checkboxDefaultProps } from './defaultProps';

import type { Ref } from 'react';
import type { CheckProps } from '../common/Check';

export type CheckboxProps = Omit<CheckProps, 'type'>;

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: Ref<HTMLLabelElement>) => (
    <Check ref={ref} type="checkbox" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
  ),
  {
    Group: CheckboxGroup,
    Button: forwardRef<HTMLLabelElement, CheckboxProps>((props, ref) => (
      <Check ref={ref} type="checkbox-button" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
    )),
  },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
