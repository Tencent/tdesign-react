import React from 'react';
import classNames from 'classnames';
import type { TdColorBaseProps } from '../../interface';
import ColorSlider from './slider';

const Alpha = (props: TdColorBaseProps) => {
  const { color, baseClassName, onChange, ...rest } = props;

  const handleChange = (v: number) => {
    onChange(v / 100);
  };

  const railStyle = {
    background: `linear-gradient(to right, rgba(0, 0, 0, 0), ${props.color.rgb})`,
  };

  return (
    <ColorSlider
      baseClassName={baseClassName}
      className={classNames([`${baseClassName}__alpha`, `${baseClassName}--bg-alpha`])}
      color={color}
      value={color.alpha * 100}
      onChange={handleChange}
      railStyle={railStyle}
      type="alpha"
      maxValue={100}
      {...rest}
    />
  );
};

export default React.memo(Alpha);
