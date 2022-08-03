import React, {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
} from 'react';
import classNames from 'classnames';

import { StyledProps } from '../common';
import { TdInputNumberProps, ChangeContext as TdChangeContext } from './type';

import useConfig from '../hooks/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import useUpdateEffect from '../_util/useUpdateEffect';

import StepHandler from './StepHandler';
import * as numberUtils from './utils/numberUtils';
import Input from '../input';
import { inputNumberDefaultProps } from './defaultProps';

export type InputNumberInternalValue = number | string;
export type ChangeContext = TdChangeContext & { value?: number };
export interface InputNumberProps extends TdInputNumberProps, StyledProps {}

const InputNumber = forwardRef((props: InputNumberProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    align,
    className,
    style,
    defaultValue,
    value,
    disabled,
    size,
    theme,
    step,
    max,
    min,
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
    decimalValue = Number(numberUtils.strToNumber(internalInputValue)) || 0;
  }

  const setInputValue = (inputStr: string) => {
    if (['', undefined].includes(inputStr)) {
      return setInternalInputValue('');
    }

    const formattedInputValue = format?.(Number(inputStr)) ?? inputStr;
    setInternalInputValue(formattedInputValue);
  };

  const [isError, setError] = useState<boolean>(false);
  const disabledDecrease = disabled || isError || (decimalValue - step < min && internalInputValue !== '');
  const disabledIncrease = disabled || isError || (decimalValue + step > max && internalInputValue !== '');

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

  const onInternalInput = (inputStr: string, { e }) => {
    if (inputStr === '') {
      setInputValue(inputStr);
      return triggerValueUpdate({ type: 'input', value: undefined, e });
    }
    if (inputStr.endsWith('.')) {
      setInternalInputValue(inputStr);
      return;
    }
    if (/^(([1-9]+[0-9]*\.0+)|(0\.0+))$/.test(inputStr)) {
      setInternalInputValue(inputStr);
      return;
    }
    const filteredInputStr = numberUtils.strToNumber(inputStr);
    if (Number.isNaN(filteredInputStr)) {
      setInternalInputValue(inputStr);
      if (!checkInput(inputStr)) return;
    }

    setInputValue(filteredInputStr.toString());
    if (!checkInput(filteredInputStr)) return;
    triggerValueUpdate({ type: 'input', value: Number(filteredInputStr), e });
  };

  const onInternalStep = (action: ChangeContext) => {
    if (props.readonly) return;

    const { type, e } = action;
    const currentValue = decimalValue || 0;
    const precision = getPrecision(currentValue);

    let updateValue: number;
    switch (type) {
      case 'add': {
        const addedVal = currentValue + step;
        updateValue = Number(Math.max(addedVal, min).toFixed(precision));
        break;
      }
      case 'reduce': {
        const reducedVal = currentValue - step;
        updateValue = Number(Math.max(reducedVal, min).toFixed(precision));
        break;
      }
    }

    setInputValue(String(updateValue));
    triggerValueUpdate({ value: updateValue, type, e });
    e.preventDefault();
  };

  const handleBlur: FocusEventHandler<HTMLDivElement> = (e) => {
    let updateValue;
    const internalFloatValue = parseFloat(internalInputValue as string);
    if (internalInputValue === '') {
      updateValue = undefined;
    } else if (!Number.isNaN(internalFloatValue)) {
      updateValue = getRangeValue(internalFloatValue);
    } else {
      const checkVal = (internalInputValue as string).replace(/[^0-9]/gi, '');
      updateValue = checkVal;
      if (!checkVal) {
        updateValue = value;
      }
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
      ref={ref}
      className={classNames(inputClassName, commonClassNames.SIZE[size], className, {
        [commonClassNames.STATUS.disabled]: disabled,
        [`${classPrefix}-is-controls-right`]: theme === 'column',
        [`${inputClassName}--${theme}`]: theme,
        [`${inputClassName}--auto-width`]: props.autoWidth,
      })}
      style={style}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeydown}
      onKeyUp={handleKeyup}
      onKeyPress={handleKeypress}
    >
      <StepHandler
        theme={theme}
        prefixClassName={inputClassName}
        disabledDecrease={disabledDecrease}
        disabledIncrease={disabledIncrease}
        onStep={onInternalStep}
      >
        <Input
          disabled={disabled}
          value={internalInputValue}
          onChange={onInternalInput}
          status={isError ? 'error' : undefined}
          align={align || (theme === 'row' ? 'center' : undefined)}
          {...restInputProps}
        />
      </StepHandler>
    </div>
  );
});

InputNumber.displayName = 'InputNumber';
InputNumber.defaultProps = inputNumberDefaultProps;

export default InputNumber;
