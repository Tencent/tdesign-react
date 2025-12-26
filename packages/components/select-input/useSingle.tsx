import React, { useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames';
import { isObject, pick } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import Input, { type InputRef, type TdInputProps } from '../input';
import Loading from '../loading';

import type { SelectInputCommonProperties } from './interface';
import type { SelectInputProps } from './SelectInput';
import type { TdSelectInputProps } from './type';

export interface RenderSelectSingleInputParams {
  tPlaceholder: string;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
  'size',
  'prefixIcon',
];

const DEFAULT_KEYS: TdSelectInputProps['keys'] = {
  label: 'label',
  value: 'value',
};

function getOptionLabel(value: TdSelectInputProps['value'], keys: TdSelectInputProps['keys']) {
  const iKeys = keys || DEFAULT_KEYS;
  return isObject(value) ? value[iKeys.label] : value;
}

export default function useSingle(props: SelectInputProps) {
  const { value, loading } = props;
  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: loading ? <Loading loading size="small" /> : props.suffixIcon,
  };

  const { classPrefix } = useConfig();
  const [inputValue, setInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const inputRef = useRef<InputRef>(null);
  const blurTimeoutRef = useRef(null);
  const customElementRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [customElementWidth, setCustomElementWidth] = useState<number>(0);

  const singleValueDisplay = useMemo(
    () => props.valueDisplay ?? getOptionLabel(value, props.keys),
    [value, props.valueDisplay, props.keys],
  );

  const showCustomElement = useMemo(
    () => !isTyping && !inputValue && React.isValidElement(singleValueDisplay),
    [isTyping, inputValue, singleValueDisplay],
  );

  const onInnerClear = (context: { e: React.MouseEvent<SVGSVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange: TdInputProps['onChange'] = (value, context) => {
    if (props.allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  useEffect(() => {
    const labelEl = inputRef.current?.currentElement.querySelector(`.${classPrefix}-input__prefix`);
    if (labelEl) {
      const prefixWidth = labelEl.getBoundingClientRect().width;
      setLabelWidth(prefixWidth);
    }
  }, [props.label, classPrefix]);

  useEffect(() => {
    if (showCustomElement && customElementRef.current) {
      const { width } = customElementRef.current.getBoundingClientRect();
      setCustomElementWidth(width);
    }
  }, [showCustomElement, singleValueDisplay]);

  const renderSelectSingle = (
    popupVisible: boolean,
    onInnerBlur?: (context: { e: React.FocusEvent<HTMLInputElement> }) => void,
  ) => {
    const handleBlur = (value, ctx) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      // 强制把 popupVisible 设置为 false 时，点击 input，会出现 blur -> focus 的情况，因此忽略前面短暂的 blur 事件
      blurTimeoutRef.current = setTimeout(() => {
        if (blurTimeoutRef.current) {
          if (!popupVisible) {
            onInnerBlur(ctx);
          } else if (!props.panel) {
            props.onBlur?.(value, { e: ctx.e, inputValue: value });
          }
        }
        blurTimeoutRef.current = null;
      }, 150);
    };

    const handleFocus = (val, context) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      props.onFocus?.(value, { ...context, inputValue: val });
      // focus might not need to change input value. it will caught some curious errors in tree-select
      // !popupVisible && setInputValue(getInputValue(value, keys), { ...context, trigger: 'input' });
    };

    const displayedValue = () => {
      if (popupVisible && inputValue) {
        return inputValue;
      }
      if (props.allowInput && popupVisible && !showCustomElement) {
        return '';
      }
      if (!showCustomElement) {
        return singleValueDisplay;
      }
      return inputValue;
    };

    const displayedPlaceholder = () => {
      if (popupVisible && singleValueDisplay && !showCustomElement) {
        return singleValueDisplay;
      }
      if (showCustomElement) return '';
      return props.placeholder;
    };

    const labelNode = showCustomElement ? (
      <div
        ref={customElementRef}
        style={{
          position: 'absolute',
          left: `${labelWidth + 8}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          textAlign: 'initial',
          zIndex: 3,
          // 输入状态，降低透明度，仿造 placeholder 效果
          opacity: popupVisible && props.allowInput ? 0.5 : undefined,
        }}
      >
        {singleValueDisplay}
      </div>
    ) : null;

    const hasCustomWidth = props.style?.width || props.inputProps?.style?.width || props.inputProps?.style?.minWidth;
    // customElement 定位为 absolute，无法撑开 input 宽度
    const inputWidth =
      !hasCustomWidth && showCustomElement && customElementWidth > 0
        ? `${customElementWidth + labelWidth + 48}px`
        : undefined;

    return (
      <Input
        ref={inputRef}
        // 当 valueDisplay 为 自定义元素时，选中内容时 input 依旧为空，确保此时 clear icon 可见
        showClearIconOnEmpty={props.clearable && showCustomElement}
        {...commonInputProps}
        suffix={
          labelNode ||
          (commonInputProps.suffix && (
            <>
              {labelNode}
              {commonInputProps.suffix}
            </>
          ))
        }
        autoWidth={props.autoWidth}
        style={{
          ...(props.inputProps?.style || {}),
          minWidth: inputWidth,
        }}
        allowInput={props.allowInput}
        label={props.label}
        value={displayedValue()}
        placeholder={displayedPlaceholder()}
        onChange={onInnerInputChange}
        onClear={onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to Input, example: click popup panel
        onFocus={handleFocus}
        onEnter={(val, context) => {
          props.onEnter?.(value, { ...context, inputValue: val });
        }}
        // onBlur need to triggered by input when popup panel is null or when popupVisible is forced to false
        onBlur={handleBlur}
        {...props.inputProps}
        onCompositionstart={(v, ctx) => {
          setIsTyping(true);
          props.inputProps?.onCompositionstart?.(v, ctx);
        }}
        onCompositionend={(v, ctx) => {
          setIsTyping(false);
          props.inputProps?.onCompositionend?.(v, ctx);
        }}
        inputClass={classNames(props.inputProps?.inputClass, {
          [`${classPrefix}-input--focused`]: popupVisible,
          [`${classPrefix}-is-focused`]: popupVisible,
        })}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    singleInputValue: inputValue,
    onInnerClear,
    renderSelectSingle,
  };
}
