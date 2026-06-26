import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isObject, pick } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import Input from '../input';
import Loading from '../loading';

import type { InputRef, TdInputProps } from '../input';
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
  const { value, loading, autoWidth } = props;
  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: loading ? <Loading loading size="small" /> : props.suffixIcon,
  };

  const { classPrefix } = useConfig();
  const [inputValue, setInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const inputRef = useRef<InputRef>(null);
  const blurTimeoutRef = useRef(null);
  const customElementRef = useRef<HTMLSpanElement>(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [customElementWidth, setCustomElementWidth] = useState<number>(0);
  const [suffixSpace, setSuffixSpace] = useState<number>(0);

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
    if (!showCustomElement || !customElementRef.current) return;
    const el = customElementRef.current;
    // 测量真实内容宽度时，临时强制 nowrap，避免被父级容器（受 suffixSpace 影响）压缩换行导致测量值偏小
    const prevWhiteSpace = el.style.whiteSpace;
    el.style.whiteSpace = 'nowrap';
    const { width } = el.getBoundingClientRect();
    el.style.whiteSpace = prevWhiteSpace;
    setCustomElementWidth((prev) => (Math.abs(prev - width) < 0.5 ? prev : width));
  }, [showCustomElement, singleValueDisplay]);

  // 当存在自定义 valueDisplay 时，labelNode 使用 absolute 定位
  // 需要给 input 设置 minWidth 来撑开宽度
  useEffect(() => {
    // autoWidth 时确保完全显示内容
    const inputEl = inputRef.current?.inputElement;
    if (!inputEl || !autoWidth) return;
    if (showCustomElement && customElementWidth > 0) {
      inputEl.style.minWidth = `${customElementWidth}px`;
    } else {
      inputEl.style.minWidth = '';
    }
  }, [autoWidth, showCustomElement, customElementWidth]);

  useEffect(() => {
    // 非 autoWidth 时避免覆盖用户在外层设置的宽度约束（width / maxWidth）
    // 测量祖先实际可用宽度作为上限
    const wrapperEl = inputRef.current?.currentElement;
    if (!wrapperEl || autoWidth) return;
    const hasUserDefinedWidth =
      props.style?.width || props.inputProps?.style?.width || props.inputProps?.style?.minWidth;
    if (hasUserDefinedWidth || !showCustomElement || customElementWidth <= 0) {
      wrapperEl.style.minWidth = '';
      return;
    }
    const width = customElementWidth + labelWidth + 48;
    // 先重置自身 minWidth，避免影响父级宽度测量
    wrapperEl.style.minWidth = '';
    const parentEl = wrapperEl.parentElement;
    const parentWidth = parentEl ? parentEl.getBoundingClientRect().width : 0;
    const finalWidth = parentWidth > 0 ? Math.min(width, parentWidth) : width;
    wrapperEl.style.minWidth = `${finalWidth}px`;
  }, [
    autoWidth,
    showCustomElement,
    customElementWidth,
    labelWidth,
    props.style?.width,
    props.inputProps?.style?.width,
    props.inputProps?.style?.minWidth,
  ]);

  useEffect(() => {
    // 避免内容延伸盖到右侧的 suffixIcon 区域，需要测量 input 右侧到 wrapper 右侧的距离作为 right 留白
    if (!showCustomElement) {
      setSuffixSpace(0);
      return;
    }
    const wrapperEl = inputRef.current?.currentElement;
    const inputEl = inputRef.current?.inputElement;
    if (!wrapperEl || !inputEl) return undefined;

    const measure = () => {
      const wrapperRect = wrapperEl.getBoundingClientRect();
      const inputRect = inputEl.getBoundingClientRect();
      // wrapper 右内边距 + suffix 区域 + suffixIcon 区域
      const space = Math.max(wrapperRect.right - inputRect.right, 0);
      setSuffixSpace((prev) => (Math.abs(prev - space) < 0.5 ? prev : space));
    };

    measure();

    wrapperEl.addEventListener('mouseenter', measure);
    wrapperEl.addEventListener('mouseleave', measure);
    return () => {
      wrapperEl.removeEventListener('mouseenter', measure);
      wrapperEl.removeEventListener('mouseleave', measure);
    };
  }, [showCustomElement, singleValueDisplay, props.clearable, props.suffixIcon, props.suffix]);

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

    const displayedValue = (): string => {
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

    const displayedPlaceholder = (): string => {
      if (popupVisible && singleValueDisplay && !showCustomElement) {
        return singleValueDisplay;
      }
      if (showCustomElement) return '';
      return props.placeholder;
    };

    const labelNode = showCustomElement ? (
      <div
        style={{
          position: 'absolute',
          left: `${labelWidth + 8}px`,
          right: `${suffixSpace}px`,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          textAlign: 'initial',
          overflow: 'hidden',
          // 输入状态，降低透明度，仿造 placeholder 效果
          opacity: popupVisible && props.allowInput ? 0.5 : undefined,
        }}
      >
        <span
          ref={customElementRef}
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            ...(autoWidth && { whiteSpace: 'nowrap' }),
          }}
        >
          {singleValueDisplay}
        </span>
      </div>
    ) : null;

    return (
      <Input
        ref={inputRef}
        // 当 valueDisplay 为 自定义元素时，选中内容时 input 依旧为空，确保此时 clear icon 可见
        showClearIconOnEmpty={props.clearable && showCustomElement}
        {...commonInputProps}
        autocomplete="off"
        suffix={
          labelNode ||
          (commonInputProps.suffix && (
            <>
              {labelNode}
              {commonInputProps.suffix}
            </>
          ))
        }
        autoWidth={autoWidth}
        style={props.inputProps?.style}
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
