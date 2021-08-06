import React, { useState, useCallback, useMemo, FocusEventHandler, KeyboardEventHandler, useEffect } from 'react';
import classNames from 'classnames';

import useConfig from '../_util/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import useUpdateEffect from '../_util/useUpdateEffect';

import StepHandler from './StepHandler';
import { ChangeContext, InputNumberProps, InputNumberInternalValue } from './InputNumberProps';
import * as numberUtils from './utils/numberUtils';

const InputNumber = React.forwardRef((props: InputNumberProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    className,
    style,
    defaultValue,
    value,
    disabled = false,
    size = 'medium',
    theme = 'row',
    step = 1,
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    decimalPlaces,
    format,
    onChange,
    onBlur,
    onFocus,
    onEnter,
    onKeydown,
    onKeyup,
    onKeypress,

    ...restInputProps
  } = props;

  const { classPrefix } = useConfig();
  const commonClassNames = useCommonClassName();
  const componentType = 'input-number';
  const inputClassName = `${classPrefix}-${componentType}`;

  const getRangeValue = (value: number) => {
    if (value < min) return min;
    if (value > max) return max;

    return value;
  };

  const [internalInputValue, setInternalInputValue] = useState<InputNumberInternalValue>(() => {
    let initialValue: InputNumberInternalValue = '';
    if (!numberUtils.isInvalidNumber(defaultValue)) {
      initialValue = getRangeValue(Number(defaultValue));
    }
    if (!numberUtils.isInvalidNumber(value)) {
      initialValue = value;
    }

    if (format && initialValue !== '') {
      return format(getRangeValue(Number(initialValue))) || '';
    }

    return initialValue;
  });

  let decimalValue: number = internalInputValue as number;
  if (typeof internalInputValue === 'string') {
    decimalValue = numberUtils.strToNumber(internalInputValue) || 0;
  }

  const setInputValue = (inputStr: string) => {
    if (['', undefined].includes(inputStr)) {
      return setInternalInputValue('');
    }

    const formattedInputValue = format?.(Number(inputStr)) ?? inputStr;
    setInternalInputValue(formattedInputValue);
  };

  const [isError, setError] = useState<boolean>(false);
  const disabledDecrease = disabled || isError || decimalValue - step < min;
  const disabledIncrease = disabled || isError || decimalValue + step > max;

  const isOutOfRange = (number: number): boolean => number > max || number < min;
  const checkInput = (inputStr: InputNumberInternalValue): boolean => {
    if (inputStr === '') {
      setError(false);
      return true;
    }

    const hasError = numberUtils.isInvalidNumber(inputStr) || isOutOfRange(Number(inputStr));
    setError(hasError);
    return !hasError;
  };

  const stepPrecision = useMemo(() => numberUtils.getNumberPrecision(step), [step]);

  const getPrecision = useCallback(
    (str: InputNumberInternalValue): number => {
      const numberPrecision = numberUtils.getNumberPrecision(str);

      return decimalPlaces ?? Math.max(numberPrecision, stepPrecision);
    },
    [stepPrecision, decimalPlaces],
  );

  useEffect(() => {
    if (value !== undefined) {
      checkInput(value);
    }
  }, [value]); // eslint-disable-line

  useUpdateEffect(() => {
    setInputValue((value ?? '').toString());
  }, [value]);

  const triggerValueUpdate = (action: ChangeContext) => {
    const { value, ...context } = action;
    if (!disabled) {
      onChange?.(value, context);
    }
  };

  const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputStr = e.target.value;
    if (inputStr === '') {
      setInputValue(inputStr);
      return triggerValueUpdate({ type: 'input', value: undefined, e });
    }

    const filteredInputStr = numberUtils.strToNumber(inputStr);

    setInputValue(filteredInputStr.toString());
    if (!checkInput(filteredInputStr)) return;
    triggerValueUpdate({ type: 'input', value: filteredInputStr, e });
  };

  const onInternalStep = (action: ChangeContext) => {
    const { type, e } = action;
    const currentValue = decimalValue || 0;
    const precision = getPrecision(currentValue);

    let updateValue;
    switch (type) {
      case 'add': {
        updateValue = Number((currentValue + step).toFixed(precision));
        break;
      }
      case 'reduce': {
        updateValue = Number((currentValue - step).toFixed(precision));
        break;
      }
    }

    setInputValue(updateValue);
    triggerValueUpdate({ value: updateValue, type, e });
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    let updateValue;

    if (internalInputValue === '') {
      updateValue = undefined;
    } else {
      updateValue = getRangeValue(parseFloat(internalInputValue as string));
    }

    onBlur?.(updateValue, { e });
    setInputValue((updateValue ?? '').toString());
    setError(false);

    if (updateValue !== value) {
      triggerValueUpdate({ value: updateValue, e, type: '' });
    }
  };
  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => onFocus?.(decimalValue, { e });
  const handleKeydownEnter: KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.key === 'Enter' && onEnter?.(decimalValue, { e });
  };
  const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    onKeydown?.(decimalValue, { e });
    handleKeydownEnter(e);
  };
  const handleKeyup: KeyboardEventHandler<HTMLDivElement> = (e) => onKeyup?.(decimalValue, { e });
  const handleKeypress: KeyboardEventHandler<HTMLDivElement> = (e) => onKeypress?.(decimalValue, { e });

  return (
    <div
      className={classNames(className, inputClassName, commonClassNames.SIZE[size], {
        [commonClassNames.STATUS.disabled]: disabled,
        't-is-controls-right': theme === 'column',
      })}
      style={style}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeydown}
      onKeyUp={handleKeyup}
      onKeyPress={handleKeypress}
    >
      {theme !== 'normal' && (
        <StepHandler
          prefixClassName={inputClassName}
          theme={theme}
          disabledDecrease={disabledDecrease}
          disabledIncrease={disabledIncrease}
          onStep={onInternalStep}
        />
      )}
      <div className={classNames(`${classPrefix}-input`, { [`${classPrefix}-is-error`]: isError })}>
        <input
          className={classNames(`${classPrefix}-input__inner`, {
            [commonClassNames.STATUS.disabled]: disabled,
            [`${inputClassName}-text-align`]: theme === 'row',
          })}
          disabled={disabled}
          ref={ref}
          value={internalInputValue}
          onChange={onInternalInput}
          autoComplete="off"
          {...restInputProps}
        />
      </div>
    </div>
  );
});

InputNumber.displayName = 'InputNumber';

export default InputNumber;
