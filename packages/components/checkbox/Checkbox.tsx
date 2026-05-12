import React from 'react';

import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check from '../common/Check';
import useDefaultProps from '../hooks/useDefaultProps';
import CheckboxGroup from './CheckboxGroup';
import { checkboxDefaultProps } from './defaultProps';

import type { CheckProps } from '../common/Check';

export type CheckboxProps = Omit<CheckProps, 'type'>;

const Checkbox = forwardRefWithStatics(
  (props: CheckboxProps, ref: React.Ref<HTMLLabelElement>) => (
    <Check ref={ref} type="checkbox" {...useDefaultProps<CheckboxProps>(props, checkboxDefaultProps)} />
  ),
  { Group: CheckboxGroup },
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
