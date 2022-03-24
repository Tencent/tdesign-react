import React from 'react';
import ColorSlider from './slider';
import { TdColorBaseProps } from '../../interface';

const HUESlider = (props: TdColorBaseProps) => {
  const { color, baseClassName, ...rest } = props;
  return (
    <ColorSlider
      baseClassName={baseClassName}
      className={`${baseClassName}__hue`}
      color={color}
      value={color.hue}
      {...rest}
    />
  );
};

export default React.memo(HUESlider);
