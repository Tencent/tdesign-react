import React from 'react';

import ColorSlider from './slider';

import type { TdColorBaseProps } from '../../interface';

const HueSlider = (props: TdColorBaseProps<number>) => {
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
