import React, { useState } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import Input from '../input';
import useConfig from '../_util/useConfig';
import useDefault from '../_util/useDefault';
import type { StyledProps, TNode } from '../common';
import type { TdRangeInputProps, RangeInputValue } from './type';

export interface RangeInputProps extends TdRangeInputProps, StyledProps {}

function calcArrayValue(value: unknown | Array<unknown>) {
  if (Array.isArray(value)) {
    return value;
  }
  return [value, value];
}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode) => {
  let result: React.ReactNode = null;

  if (icon) result = icon;

  if (typeof icon === 'function') result = icon();

  const iconClassName = icon ? `${classPrefix}-range-input__${type}-icon` : '';

  if (result) {
    result = <span className={`${classPrefix}-range-input__${type} ${iconClassName}`}>{result}</span>;
  }

  return result;
};

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
    suffix,
    prefixIcon,
    suffixIcon,
    onFocus,
    onBlur,
    onChange: onChangeFromProps,
  } = props;

  const name = `${classPrefix}-range-input`;

  const [isFocused, toggleIsFocused] = useState(false);
  const [leftFormat, rightFormat] = calcArrayValue(format);
  const [leftPlaceholder = '请输入内容', rightPlaceholder = '请输入内容'] = calcArrayValue(placeholder);
  const [leftInputProps, rightInputProps] = calcArrayValue(inputProps);

  const [value, onChange] = useDefault(valueFromProps, defaultValue, onChangeFromProps);
  const [leftValue, rightValue] = value || [];

  const labelContent = isFunction(label) ? label() : label;
  const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
  const suffixContent = isFunction(suffix) ? suffix() : suffix;
  const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIcon);

  function handleFocus(rangeValue: RangeInputValue, context) {
    onFocus?.(rangeValue, context);
    toggleIsFocused(true);
  }

  function handleBlur(rangeValue: RangeInputValue, context) {
    onBlur?.(rangeValue, context);
    toggleIsFocused(false);
  }

  return (
    <div
      ref={ref}
      style={style}
      className={classNames(name, className, {
        [`${classPrefix}-is-focused`]: isFocused,
        [`${classPrefix}-is-${status}`]: status,
      })}
    >
      <div className={`${name}__inner`}>
        {prefixIconContent}
        {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
        <Input
          className={`${name}__inner-left`}
          placeholder={leftPlaceholder}
          disabled={disabled}
          readonly={readonly}
          format={leftFormat}
          value={leftValue}
          onFocus={(val, { e }) => handleFocus([val, rightValue], { e, position: 'first' })}
          onBlur={(val, { e }) => handleBlur([val, rightValue], { e, position: 'first' })}
          onChange={(val, { e }) => onChange?.([val, rightValue], { e, position: 'first' })}
          {...leftInputProps}
        />

        <div className={`${name}__inner-separator`}>{separator}</div>

        <Input
          className={`${name}__inner-right`}
          placeholder={rightPlaceholder}
          disabled={disabled}
          readonly={readonly}
          format={rightFormat}
          value={rightValue}
          onFocus={(val, { e }) => handleFocus([leftValue, val], { e, position: 'second' })}
          onBlur={(val, { e }) => handleBlur([leftValue, val], { e, position: 'second' })}
          onChange={(val, { e }) => onChange?.([leftValue, val], { e, position: 'second' })}
          {...rightInputProps}
        />
        {suffixContent ? <div className={`${name}__suffix`}>{suffixContent}</div> : null}
        {suffixIconContent}
      </div>
      {tips && <div className={`${name}__tips`}>{tips}</div>}
    </div>
  );
});

RangeInput.displayName = 'RangeInput';

export default RangeInput;
