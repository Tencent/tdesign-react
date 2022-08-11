import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useCommonClassName from '../_util/useCommonClassName';
import { InputNumberValue, TdInputNumberProps } from './type';
// 计算逻辑，统一到 common 中，方便各框架复用（如超过 16 位的大数处理）
import {
  canAddNumber,
  canInputNumber,
  canReduceNumber,
  formatToNumber,
  getMaxOrMinValidateResult,
  getStepValue,
} from '../_common/js/input-number/number';

/**
 * 独立一个组件 Hook 方便用户直接使用相关逻辑 自定义任何样式的数字输入框
 */
export default function useInputNumber(props: TdInputNumberProps) {
  const { SIZE, STATUS } = useCommonClassName();
  const { classPrefix } = useConfig();
  const [value, onChange] = useControlled(props, 'value', props.onChange);
  const [userInput, setUserInput] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [isError, setIsError] = useState<'exceed-maximum' | 'below-minimum'>();

  const inputRef = useRef(null);

  const { max, min, largeNumber, onValidate } = props;

  const disabledReduce = props.disabled || !canReduceNumber(value, props.min, props.largeNumber);
  const disabledAdd = props.disabled || !canAddNumber(value, props.max, props.largeNumber);

  const wrapClasses = classNames(`${classPrefix}-input-number`, SIZE[props.size], {
    [STATUS.disabled]: props.disabled,
    [`${classPrefix}-is-controls-right`]: props.theme === 'column',
    [`${classPrefix}-input-number--${props.theme}`]: props.theme,
    [`${classPrefix}-input-number--auto-width`]: props.autoWidth,
  });

  const reduceClasses = classNames(`${classPrefix}-input-number__decrease`, { [STATUS.disabled]: disabledReduce });
  const addClasses = classNames(`${classPrefix}-input-number__increase`, { [STATUS.disabled]: disabledAdd });

  const getUserInput = (value: InputNumberValue) => {
    if (!value && value !== 0) return '';
    let inputStr = String(value);
    if (!inputRef.current.currentElement.contains?.(document.activeElement)) {
      inputStr = String(
        formatToNumber(inputStr, {
          decimalPlaces: props.decimalPlaces,
          largeNumber: props.largeNumber,
        }),
      );
      if (props.format) {
        inputStr = String(props.format(value, { fixedNumber: inputStr }));
      }
    }
    return inputStr;
  };

  useEffect(() => {
    const inputValue = [undefined, null].includes(value) ? '' : String(value);
    setUserInput(getUserInput(inputValue));
    // eslint-disable-next-line
  }, [value]);

  useEffect(() => {
    // @ts-ignore
    if ([undefined, '', null].includes(value)) return;
    const error = getMaxOrMinValidateResult({
      value,
      max,
      min,
      largeNumber,
    });
    setIsError(error);
    onValidate?.({ error });
  }, [value, max, min, largeNumber, onValidate]);

  const handleStepValue = (op: 'add' | 'reduce') =>
    getStepValue({
      op,
      step: props.step,
      max: props.max,
      min: props.min,
      lastValue: value,
      largeNumber: props.largeNumber,
    });

  const handleReduce = (e: any) => {
    if (disabledReduce || props.readonly) return;
    const newValue = handleStepValue('reduce');
    onChange(newValue, { type: 'reduce', e });
  };

  const handleAdd = (e: any) => {
    if (disabledAdd || props.readonly) return;
    const newValue = handleStepValue('add');
    onChange(newValue, { type: 'add', e });
  };

  const onInnerInputChange = (val: string, ctx: { e: any }) => {
    if (!canInputNumber(val, props.largeNumber)) return;
    setUserInput(val);
    // 大数-字符串；普通数-数字
    const newVal = props.largeNumber || !val ? val : Number(val);
    if (newVal !== value && !['-', '.', 'e', 'E'].includes(val.slice(-1))) {
      onChange(newVal, { type: 'input', e: ctx.e });
    }
  };

  const handleBlur = (value: string, ctx: { e: React.FocusEvent<HTMLDivElement, Element> }) => {
    setUserInput(getUserInput(value));
    const newValue = formatToNumber(value, {
      decimalPlaces: props.decimalPlaces,
      largeNumber: props.largeNumber,
    });
    if (newValue !== value && String(newValue) !== value) {
      onChange(newValue, { type: 'blur', e: ctx.e });
    }
    props.onBlur?.(newValue, ctx);
  };

  const handleFocus = (_: string, ctx: { e: React.FocusEvent<HTMLDivElement, Element> }) => {
    setUserInput(value as string);
    props.onFocus?.(value, ctx);
  };

  const handleKeydown = (value: string, ctx: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    const { e } = ctx;
    const keyEvent = {
      ArrowUp: handleAdd,
      ArrowDown: handleReduce,
    };
    const code = e.code || e.key;
    if (keyEvent[code] !== undefined) {
      keyEvent[code](e);
    }
    props.onKeydown?.(value, ctx);
  };

  const handleKeyup = (value: string, ctx: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    props.onKeyup?.(value, ctx);
  };

  const handleKeypress = (value: string, ctx: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    props.onKeypress?.(value, ctx);
  };

  const handleEnter = (value: string, ctx: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    setUserInput(getUserInput(value));
    const newValue = formatToNumber(value, {
      decimalPlaces: props.decimalPlaces,
      largeNumber: props.largeNumber,
    });
    if (newValue !== value && String(newValue) !== value) {
      onChange(newValue, { type: 'enter', e: ctx.e });
    }
    props.onEnter?.(newValue, ctx);
  };

  const listeners = {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeydown: handleKeydown,
    onKeyup: handleKeyup,
    onKeypress: handleKeypress,
    onEnter: handleEnter,
  };

  return {
    classPrefix,
    wrapClasses,
    reduceClasses,
    addClasses,
    inputRef,
    listeners,
    displayValue,
    setDisplayValue,
    isError,
    setIsError,
    userInput,
    setUserInput,
    value,
    onChange,
    handleReduce,
    handleAdd,
    onInnerInputChange,
  };
}
