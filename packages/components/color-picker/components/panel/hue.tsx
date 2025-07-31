import React from 'react';
import type { TdColorBaseProps } from '../../interface';
import ColorSlider from './slider';

const HueSlider = (props: TdColorBaseProps) => {
  const { color, baseClassName, disabled, onChange } = props;
  return (
    <ColorSlider
      disabled={disabled}
      baseClassName={baseClassName}
      className={`${baseClassName}__hue`}
      color={color}
      value={color.hue}
      type="hue"
      onChange={onChange}
    />
  );
};

export default React.memo(HueSlider);
