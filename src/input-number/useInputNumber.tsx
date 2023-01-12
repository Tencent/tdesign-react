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
import { InputProps } from '../input';

export const specialCode = ['-', '.', 'e', 'E'];

/**
 * 独立一个组件 Hook 方便用户直接使用相关逻辑 自定义任何样式的数字输入框
 */
export default function useInputNumber<T extends InputNumberValue = InputNumberValue>(props: TdInputNumberProps<T>) {
  const { SIZE, STATUS } = useCommonClassName();
  const { classPrefix } = useConfig();
  const [tValue, onChange] = useControlled(props, 'value', props.onChange);
  const [userInput, setUserInput] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [isError, setIsError] = useState<'exceed-maximum' | 'below-minimum'>();

  const inputRef = useRef(null);

  const { max, min, largeNumber, decimalPlaces, allowInputOverLimit, onValidate } = props;

  const disabledReduce = props.disabled || !canReduceNumber(tValue, props.min, props.largeNumber);
  const disabledAdd = props.disabled || !canAddNumber(tValue, props.max, props.largeNumber);

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
    let inputStr = value || value === 0 ? String(value) : '';
    if (!inputRef.current.currentElement.contains?.(document.activeElement)) {
      const num = formatToNumber(inputStr, {
        decimalPlaces,
        largeNumber,
      });
      inputStr = num || num === 0 ? String(num) : '';
      if (props.format) {
        inputStr = String(props.format(value, { fixedNumber: inputStr }));
      }
    }
    return inputStr;
  };

  useEffect(() => {
    const inputValue = [undefined, null].includes(tValue) ? '' : String(tValue);
    setUserInput(getUserInput(inputValue));
    // eslint-disable-next-line
  }, [tValue]);

  useEffect(() => {
    // @ts-ignore
    if ([undefined, '', null].includes(tValue)) return;
    const error = getMaxOrMinValidateResult({
      value: tValue as InputNumberValue,
      max,
      min,
      largeNumber,
    });
    setIsError(error);
    onValidate?.({ error });
  }, [tValue, max, min, largeNumber, onValidate]);

  const handleStepValue = (op: 'add' | 'reduce') => {
    const newValue = getStepValue({
      op,
      step: props.step,
      max: props.max,
      min: props.min,
      lastValue: tValue,
      largeNumber: props.largeNumber,
    });
    const { largeNumber, max, min } = props;
    const overLimit = getMaxOrMinValidateResult({
      value: newValue,
      largeNumber,
      max,
      min,
    });
    return {
      overLimit,
      newValue,
    };
  };

  const handleReduce = (e: any) => {
    if (disabledReduce || props.readonly) return;
    const r = handleStepValue('reduce');
    if (r.overLimit && !allowInputOverLimit) return;
    onChange(r.newValue, { type: 'reduce', e });
  };

  const handleAdd = (e: any) => {
    if (disabledAdd || props.readonly) return;
    const r = handleStepValue('add');
    if (r.overLimit && !allowInputOverLimit) return;
    onChange(r.newValue, { type: 'add', e });
  };

  // 1.2 -> 1. -> 1
  const onInnerInputChange = (val: string, { e }: { e: any }) => {
    if (!canInputNumber(val, largeNumber)) return;
    if (props.largeNumber) {
      onChange(val as T, { type: 'input', e });
      return;
    }
    // specialCode 新增或删除这些字符时不触发 change 事件
    const isDelete = e.nativeEvent.inputType === 'deleteContentBackward';
    const inputSpecialCode = specialCode.includes(val.slice(-1)) || val.slice(-2) === '.0';
    const deleteSpecialCode = isDelete && specialCode.includes(String(userInput).slice(-1));
    if ((!isNaN(Number(val)) && !inputSpecialCode) || deleteSpecialCode) {
      const newVal = val === '' ? undefined : Number(val);
      onChange(newVal as T, { type: 'input', e });
    }
    if (inputSpecialCode || deleteSpecialCode) {
      setUserInput(val);
    }
  };

  const handleBlur = (value: string, ctx: { e: React.FocusEvent<HTMLDivElement, Element> }) => {
    if (!props.allowInputOverLimit && value) {
      const r = getMaxOrMinValidateResult({
        value: tValue,
        largeNumber,
        max,
        min,
      });
      if (r === 'below-minimum') {
        onChange(min as T, { type: 'blur', e: ctx.e });
        return;
      }
      if (r === 'exceed-maximum') {
        onChange(max as T, { type: 'blur', e: ctx.e });
        return;
      }
    }
    setUserInput(getUserInput(value));
    const newValue = formatToNumber(value, {
      decimalPlaces,
      largeNumber,
    });
    if (newValue !== value && String(newValue) !== value) {
      onChange(newValue as T, { type: 'blur', e: ctx.e });
    }
    props.onBlur?.(newValue, ctx);
  };

  const handleFocus = (_: string, ctx: { e: React.FocusEvent<HTMLDivElement, Element> }) => {
    setUserInput(tValue as string);
    props.onFocus?.(tValue as string, ctx);
  };

  const handleKeydown = (value: string, ctx: { e: React.KeyboardEvent<HTMLDivElement> }) => {
    const { e } = ctx;
    const keyEvent = {
      ArrowUp: handleAdd,
      ArrowDown: handleReduce,
    };

    if (keyEvent[e.key] !== undefined) {
      keyEvent[e.key](e);
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
      onChange(newValue as T, { type: 'enter', e: ctx.e });
    }
    props.onEnter?.(newValue, ctx);
  };

  const handleClear: InputProps['onClear'] = ({ e }) => {
    onChange(undefined, { type: 'clear', e });
    setUserInput('');
  };

  const focus = () => {
    inputRef.current.focus();
  };

  const blur = () => {
    inputRef.current.blur();
  };

  const listeners = {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeydown: handleKeydown,
    onKeyup: handleKeyup,
    onKeypress: handleKeypress,
    onEnter: handleEnter,
    onClick: focus,
    onClear: handleClear,
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
    tValue,
    focus,
    blur,
    onChange,
    handleReduce,
    handleAdd,
    onInnerInputChange,
  };
}
