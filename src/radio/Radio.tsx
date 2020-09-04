import React, { Ref, forwardRef } from 'react';
import Check, { CheckProps } from '../check';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import RadioGroup from './RadioGroup';

/**
 * Radio 组件所接收的属性
 */
export interface RadioProps extends Omit<CheckProps, 'type' | 'indeterminate'> {}

const Radio = forwardRefWithStatics(
  (props: RadioProps, ref: Ref<HTMLLabelElement>) => <Check ref={ref} type="radio" {...props} />,
  // statics
  {
    Group: RadioGroup,
    Button: forwardRef((props: RadioProps, ref: Ref<HTMLLabelElement>) => (
      <Check ref={ref} type="radio-button" {...props} />
    )),
  },
);

Radio.displayName = 'Radio';

export default Radio;
