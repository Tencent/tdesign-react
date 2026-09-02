import React from 'react';
import classNames from 'classnames';
import { Color, getColorObject } from '@tdesign/common-js/color-picker/color';

import noop from '../../_util/noop';
import { Input } from '../../input';
import useClassName from '../hooks/useClassNames';

import type { TdColorPickerProps } from '..';
import type { TdColorContext } from '../interface';

export interface ColorTriggerProps extends Pick<
  TdColorPickerProps,
  'disabled' | 'inputProps' | 'borderless' | 'clearable' | 'enableAlpha' | 'onClear'
> {
  value?: string;
  onChange?: (v?: string, context?: TdColorContext) => {};
}

const ColorPickerTrigger = (props: ColorTriggerProps) => {
  const baseClassName = useClassName();
  const {
    disabled = false,
    borderless = false,
    inputProps = { autoWidth: true },
    clearable,
    enableAlpha,
    onClear,
  } = props;

  const handleChange = (input: string) => {
    if (input !== props.value) {
      props.onChange?.(input, {
        color: getColorObject(new Color(input)),
        trigger: 'input',
      });
    }
  };

  return (
    <div className={`${baseClassName}__trigger--default`}>
      <Input
        borderless={borderless}
        clearable={clearable}
        {...inputProps}
        value={props.value}
        disabled={disabled}
        label={
          <div className={`${baseClassName}__trigger--default__color`}>
            {enableAlpha ? (
              <span
                className={classNames('color-inner', `${baseClassName}--bg-alpha`)}
                style={{ borderColor: props.value }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    background: props.value,
                  }}
                />
              </span>
            ) : (
              <span className="color-inner" style={{ background: props.value }} />
            )}
          </div>
        }
        onChange={handleChange}
        onClear={onClear || noop}
      />
    </div>
  );
};

export default React.memo(ColorPickerTrigger);
