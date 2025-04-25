import React from 'react';
import classNames from 'classnames';
import ColorLib from '@tdesign/common-js/color-picker/color';
import { Input } from '../../input';
import { TdColorPickerProps } from '..';
import useClassName from '../hooks/useClassNames';
import useControlled from '../../hooks/useControlled';
import { TdColorContext } from '../interface';
import noop from '../../_util/noop';

export interface ColorTriggerProps
  extends Pick<TdColorPickerProps, 'disabled' | 'inputProps' | 'borderless' | 'clearable' | 'onClear'> {
  value?: string;
  onChange?: (v?: string, context?: TdColorContext) => {};
}

const ColorPickerTrigger = (props: ColorTriggerProps) => {
  const baseClassName = useClassName();
  const { disabled = false, borderless = false, inputProps = { autoWidth: true }, clearable, onClear } = props;

  const [value, setValue] = useControlled(props, 'value', props.onChange);

  const handleChange = (input: string, ctx: any) => {
    if (ColorLib.isValid(input)) {
      setValue(input, ctx);
    }
  };

  return (
    <div className={`${baseClassName}__trigger--default`}>
      <Input
        borderless={borderless}
        clearable={clearable}
        {...inputProps}
        value={value}
        disabled={disabled}
        label={
          <div className={classNames(`${baseClassName}__trigger--default__color`, `${baseClassName}--bg-alpha`)}>
            <span className={'color-inner'} style={{ background: value }}></span>
          </div>
        }
        onBlur={handleChange}
        onChange={(v: string) => setValue(v)}
        onClear={onClear || noop}
      />
    </div>
  );
};

export default React.memo(ColorPickerTrigger);
