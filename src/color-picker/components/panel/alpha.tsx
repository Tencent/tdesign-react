import React from 'react';
import classNames from 'classnames';
import ColorSlider from './slider';
import { TdColorBaseProps } from '../../interface';

const AlphaSlider = (props: TdColorBaseProps) => {
  const { color, baseClassName, ...rest } = props;
  return (
    <ColorSlider
      baseClassName={baseClassName}
      className={classNames([`${baseClassName}__alpha`, `${baseClassName}--bg-alpha`])}
      color={color}
      value={color.hue}
      {...rest}
    />
  );
};

export default React.memo(AlphaSlider);
