import React from 'react';
import classNames from 'classnames';
import Input from '../input';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import type { StyledProps } from '../common';
import type { TdRangeInputProps } from './type';

export interface RangeInputProps extends TdRangeInputProps, StyledProps {}

function calcArrayValue(value: unknown | Array<unknown>) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value];
}

const RangeInput = React.forwardRef((props: RangeInputProps, ref: React.RefObject<HTMLDivElement>) => {
  const { classPrefix } = useConfig();

  const {
    value: valueFromProps,
    defaultValue,
    className,
    style,
    disabled,
    format,
    inputProps,
    label,
    placeholder,
    readonly,
    separator = '-',
    status,
    tips,
    onChange: onChangeFromProps,
  } = props;

  const name = `${classPrefix}-range-input`;

  const [leftLabel, rightLabel] = calcArrayValue(label);
  const [leftFormat, rightFormat] = calcArrayValue(format);
  const [leftPlaceholder, rightPlaceholder] = calcArrayValue(placeholder);
  const [leftInputProps, rightInputProps] = calcArrayValue(inputProps);

  const [value, onChange] = useDefault(valueFromProps, defaultValue, onChangeFromProps);
  const [leftValue, rightValue] = value || [];

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(name, className, {
        [`${classPrefix}-is-${status}`]: status,
      })}
    >
      <div className={`${name}__content`}>
        <Input
          className={`${name}__content-left`}
          placeholder={leftPlaceholder}
          disabled={disabled}
          readonly={readonly}
          format={leftFormat}
          label={leftLabel}
          value={leftValue}
          onChange={(val, { e }) => onChange?.([val, rightValue], { e, position: 'first' })}
          {...leftInputProps}
        />

        <div className={`${name}__content-separator`}>{separator}</div>

        <Input
          className={`${name}__content-right`}
          placeholder={rightPlaceholder}
          disabled={disabled}
          readonly={readonly}
          format={rightFormat}
          label={rightLabel}
          value={rightValue}
          onChange={(val, { e }) => onChange?.([leftValue, val], { e, position: 'second' })}
          {...rightInputProps}
        />
      </div>
      {tips && <div className={`${name}__tips`}>{tips}</div>}
    </div>
  );
});

RangeInput.displayName = 'RangeInput';

export default RangeInput;
