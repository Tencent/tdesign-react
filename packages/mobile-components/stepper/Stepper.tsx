import React, { forwardRef, memo } from 'react';
import classNames from 'classnames';
import { AddIcon, RemoveIcon } from 'tdesign-icons-react';
import { usePrefixClass } from '../hooks/useClass';
import useDefaultProps from '../hooks/useDefaultProps';
import useDefault from '../_util/useDefault';
import { formatNumber } from '../_util/formatNumber';
import { StyledProps } from '../common';
import { TdStepperProps } from './type';
import { stepperDefaultProps } from './defaultProps';

export interface StepperProps extends TdStepperProps, StyledProps {}

const Stepper = forwardRef<HTMLDivElement, StepperProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, stepperDefaultProps);
  const {
    className,
    style,
    disableInput,
    disabled,
    inputWidth,
    integer,
    max,
    size,
    min,
    step,
    theme,
    value,
    defaultValue,
    onBlur,
    onChange,
    onFocus,
    onOverlimit,
  } = props;

  const [currentValue, setCurrentValue] = useDefault(value, defaultValue, onChange);

  const stepperClass = usePrefixClass('stepper');

  const inputStyle = inputWidth ? { width: `${inputWidth}px` } : {};

  const isDisabled = (type: 'minus' | 'plus') => {
    if (disabled) return true;
    if (type === 'minus' && Number(currentValue) <= min) {
      return true;
    }
    if (type === 'plus' && Number(currentValue) >= max) {
      return true;
    }
    return false;
  };

  const getLen = (num: number) => {
    const numStr = num.toString();
    return numStr.indexOf('.') === -1 ? 0 : numStr.split('.')[1].length;
  };

  /**
   * 精确加法
   */
  const add = (a: number, b: number) => {
    const maxLen = Math.max(getLen(a), getLen(b));
    const base = 10 ** maxLen;
    return Math.round(a * base + b * base) / base;
  };

  const formatValue = (value: number) =>
    Math.max(Math.min(max, value, Number.MAX_SAFE_INTEGER), min, Number.MIN_SAFE_INTEGER).toFixed(
      Math.max(getLen(step), getLen(value)),
    );

  const updateValue = (value: TdStepperProps['value']) => {
    setCurrentValue(formatNumber(`${value}`, !integer));
  };

  const plusValue = () => {
    if (isDisabled('plus')) {
      onOverlimit?.('plus');
      return;
    }
    updateValue(formatValue(add(Number(currentValue), step)));
  };

  const minusValue = () => {
    if (isDisabled('minus')) {
      onOverlimit?.('minus');
      return;
    }
    updateValue(formatValue(add(Number(currentValue), -step)));
  };

  const handleChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { value } = e.currentTarget;
    if (isNaN(Number(value))) return;
    setCurrentValue(formatNumber(value, !integer));
  };

  const handleFocus = () => {
    onFocus?.(Number(currentValue));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { value } = e.currentTarget;
    if (isNaN(Number(value))) return;
    const formattedValue = formatValue(Number(value));
    setCurrentValue(formattedValue);
    onBlur?.(formattedValue);
  };

  return (
    <div className={classNames(stepperClass, `${stepperClass}--${size}`, className)} style={style} ref={ref}>
      <div
        className={classNames(
          `${stepperClass}__minus`,
          `${stepperClass}__minus--${theme}`,
          `${stepperClass}__icon--${size}`,
          {
            [`${stepperClass}--${theme}-disabled`]: disabled || Number(currentValue) <= props.min,
          },
        )}
        onClick={minusValue}
      >
        <RemoveIcon className={`${stepperClass}__minus-icon`} />
      </div>
      <input
        value={currentValue}
        className={classNames(
          `${stepperClass}__input`,
          `${stepperClass}__input--${theme}`,
          `${stepperClass}__input--${size}`,
          {
            [`${stepperClass}--${theme}-disabled`]: disabled,
          },
        )}
        type={integer ? 'tel' : 'text'}
        inputMode={integer ? 'numeric' : 'decimal'}
        style={inputStyle}
        disabled={disableInput || disabled}
        readOnly={disableInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <div
        className={classNames(
          `${stepperClass}__plus`,
          `${stepperClass}__plus--${theme}`,
          `${stepperClass}__icon--${size}`,
          {
            [`${stepperClass}--${theme}-disabled`]: disabled || Number(currentValue) >= max,
          },
        )}
        onClick={plusValue}
      >
        <AddIcon className={`${stepperClass}__plus-icon`} />
      </div>
    </div>
  );
});

Stepper.displayName = 'Stepper';

export default memo(Stepper);
