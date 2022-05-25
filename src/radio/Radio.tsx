import React, { Ref, forwardRef } from 'react';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import Check, { CheckProps } from '../common/Check';
import RadioGroup from './RadioGroup';
import { radioDefaultProps } from './defaultProps';

export type RadioProps = Omit<CheckProps, 'type'>;

const Radio = forwardRefWithStatics(
  (props: RadioProps, ref: Ref<HTMLLabelElement>) => <Check ref={ref} type="radio" {...props} />,
  {
    Group: RadioGroup,
    Button: forwardRef((props: RadioProps, ref: Ref<HTMLLabelElement>) => (
      <Check ref={ref} type="radio-button" {...props} />
    )),
  },
);

Radio.displayName = 'Radio';
Radio.defaultProps = radioDefaultProps;

export default Radio;
