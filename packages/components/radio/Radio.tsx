import type { Ref } from 'react';
import React, { forwardRef } from 'react';

import { radioDefaultProps } from './defaultProps';
import RadioGroup from './RadioGroup';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check from '../common/Check';
import useDefaultProps from '../hooks/useDefaultProps';

import type { CheckProps } from '../common/Check';

export type RadioProps = Omit<CheckProps, 'type'>;

const Radio = forwardRefWithStatics(
  (props: RadioProps, ref: Ref<HTMLLabelElement>) => (
    <Check ref={ref} type="radio" {...useDefaultProps<RadioProps>(props, radioDefaultProps)} />
  ),
  {
    Group: RadioGroup,
    Button: forwardRef<HTMLLabelElement, RadioProps>((props, ref) => (
      <Check ref={ref} type="radio-button" {...useDefaultProps<RadioProps>(props, radioDefaultProps)} />
    )),
  },
);

Radio.displayName = 'Radio';

export default Radio;
