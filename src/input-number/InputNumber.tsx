import React, { useState, useCallback, useMemo, FocusEventHandler, KeyboardEventHandler } from 'react';
import classNames from 'classnames';

import useConfig from '../_util/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import useUpdateEffect from '../_util/useUpdateEffect';

import StepHandler from './StepHandler';
import { InputNumberChangeAction, InputNumberProps, InputNumberInternalValue } from './InputNumber.types';
import * as numberUtils from './utils/numberUtils';

export const InputNumber = React.forwardRef((props: InputNumberProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    className,
    style,
    defaultValue,
    value,
    disabled = false,
    size = 'medium',
    mode = 'row',
    step = 1,
    max = Number.MAX_SAFE_INTEGER,
    min = Number.MIN_SAFE_INTEGER,
    formatter,
    onChange,
    onBlur,
    onFocus,
    onKeydownEnter,
    onKeydown,
    onKeyup,
    onKeypress,

    ...restInputProps
  } = props;

  const { classPrefix } = useConfig();
  const CommonClassNames = useCommonClassName();
  const componentType = 'input-number';
  const inputClassName = `${classPrefix}-${componentType}`;

  const [internalInputValue, setInternalInputValue] = useState<InputNumberInternalValue>(() => {
    const initialValue = defaultValue ?? value ?? '';
    return formatter?.(initialValue) ?? initialValue;
  });

  let decimalValue: number = internalInputValue as number;
  if (typeof internalInputValue === 'string') {
    decimalValue = Number(numberUtils.filterInput(internalInputValue));
  }

  const setInputValue = (inputStr) => {
    const formattedInputValue = formatter?.(inputStr) ?? inputStr;
    setInternalInputValue(formattedInputValue);
  };

  const [isError, setError] = useState<boolean>(false);
  const disabledDecrease = disabled || isError || decimalValue - step < min;
  const disabledIncrease = disabled || isError || decimalValue + step > max;

  const isOutOfRange = (number: number): boolean => number > max || number < min;
  const checkInput = (inputStr: InputNumberInternalValue): boolean => {
    const hasError = numberUtils.isInValidNumber(inputStr) || isOutOfRange(Number(inputStr));
    setError(hasError);
    return !hasError;
  };

  const stepPrecision = useMemo(() => numberUtils.getNumberPrecision(step), [step]);
  const getPrecision = useCallback(
    (str: InputNumberInternalValue): number => {
      const numberPrecision = numberUtils.getNumberPrecision(str);
      return Math.max(numberPrecision, stepPrecision);
    },
    [stepPrecision],
  );

  useUpdateEffect(() => {
    checkInput(value);
    setInputValue(value);
  }, [value]);

  const triggerValueUpdate = (action: InputNumberChangeAction) => {
    const { value, ...context } = action;
    if (!disabled) {
      onChange?.(value, context);
    }
  };

  const onInternalInput: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const inputStr = event.target.value;
    const filteredInputStr = numberUtils.filterInput(inputStr);

    setInputValue(filteredInputStr);
    if (!checkInput(filteredInputStr)) return;
    triggerValueUpdate({ type: 'input', value: Number(filteredInputStr), event });
  };

  const onInternalStep = (action: InputNumberChangeAction) => {
    const { type, event } = action;
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
    triggerValueUpdate({ value: updateValue, type, event });
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => onBlur?.(decimalValue, { e });
  const handleFocus: FocusEventHandler<HTMLDivElement> = (e) => onFocus?.(decimalValue, { e });
  const handleKeydownEnter: KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.key === 'Enter' && onKeydownEnter?.(decimalValue, { e });
  };
  const handleKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    onKeydown?.(decimalValue, { e });
    handleKeydownEnter(e);
  };
  const handleKeyup: KeyboardEventHandler<HTMLDivElement> = (e) => onKeyup?.(decimalValue, { e });
  const handleKeypress: KeyboardEventHandler<HTMLDivElement> = (e) => onKeypress?.(decimalValue, { e });

  return (
    <div
      className={classNames(className, inputClassName, CommonClassNames.SIZE[size], {
        [CommonClassNames.STATUS.disabled]: disabled,
        't-is-controls-right': mode === 'column',
      })}
      style={style}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeydown}
      onKeyUp={handleKeyup}
      onKeyPress={handleKeypress}
    >
      <StepHandler
        prefixCls={inputClassName}
        mode={mode}
        disabledDecrease={disabledDecrease}
        disabledIncrease={disabledIncrease}
        onStep={onInternalStep}
      />
      <div className={classNames(`${classPrefix}-input`, { [`${classPrefix}-is-error`]: isError })}>
        <input
          className={classNames(`${classPrefix}-input__inner`, {
            [CommonClassNames.STATUS.disabled]: disabled,
            [`${inputClassName}-text-align`]: mode === 'row',
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
