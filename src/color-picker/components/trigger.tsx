import React, { useState } from 'react';
import classNames from 'classnames';
import { Input } from '../../input';
import ColorLib from '../utils/color';
import { TdColorPickerProps } from '..';
import useClassname from '../hooks/useClassname';
import { TdColorContext } from '../interface';

export interface ColorTriggerProps extends TdColorPickerProps {
  color?: string;
  onTriggerChange?: (v?: string, context?: TdColorContext) => {};
}

const ColorPickerTrigger = (props: ColorTriggerProps) => {
  const baseClassName = useClassname();
  const {
    color = '',
    disabled = false,
    inputProps = {
      autoWidth: true,
    },
    onTriggerChange,
  } = props;

  const [value, setValue] = useState(color);

  const handleChange = (input: string) => {
    if (input === value) {
      return;
    }
    if (ColorLib.isValid(input)) {
      setValue(input);
    }
    onTriggerChange(value);
  };

  return (
    <div className={`${baseClassName}__trigger--default`}>
      <Input
        {...inputProps}
        value={value}
        disabled={disabled}
        label={
          <div className={classNames(`${baseClassName}__trigger--default__color`, `${baseClassName}--bg-alpha`)}>
            <span
              className={'color-inner'}
              style={{
                background: color,
              }}
            ></span>
          </div>
        }
        onBlur={handleChange}
      />
    </div>
  );
};

export default React.memo(ColorPickerTrigger);
