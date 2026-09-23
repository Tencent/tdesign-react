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
  'readonly', // to be deprecated
  'readOnly',
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

const getOptionLabel = (value: TdSelectInputProps['value'], keys: TdSelectInputProps['keys']) => {
  const iKeys = keys || DEFAULT_KEYS;
  return isObject(value) ? value[iKeys.label] : value;
};

export default function useSingle(props: SelectInputProps) {
  const { value, autoWidth, inputProps, label, allowInput, clearable, keys, valueDisplay, suffixIcon } = props;
  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: props.loading ? <Loading loading size="small" /> : suffixIcon,
  };

  const { classPrefix } = useConfig();
  const [inputValue, setInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const inputRef = useRef<InputRef>(null);
  const blurTimeoutRef = useRef(null);
  const customElementRef = useRef<HTMLSpanElement>(null);

  // 以下三个状态仅在 allowInput=true 时有意义
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [labelWidth, setLabelWidth] = useState<number>(0);
  const [suffixSpace, setSuffixSpace] = useState<number>(0);

  const singleValueDisplay = useMemo(() => valueDisplay ?? getOptionLabel(value, keys), [value, valueDisplay, keys]);

  // allowInput=true 时 DOM 结构采用 absolute 覆盖层实现
  const showCustomElement = useMemo(
    () => allowInput && !isTyping && !inputValue && React.isValidElement(singleValueDisplay),
    [allowInput, isTyping, inputValue, singleValueDisplay],
  );

  const onInnerClear = (context: { e: React.MouseEvent<SVGSVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange: TdInputProps['onChange'] = (value, context) => {
    if (allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  useEffect(() => {
    if (!allowInput) return;
    const labelEl = inputRef.current?.currentElement.querySelector(`.${classPrefix}-input__prefix`);
    if (labelEl) {
      const prefixWidth = labelEl.getBoundingClientRect().width;
      setLabelWidth(prefixWidth);
    }
  }, [allowInput, label, classPrefix]);

  useEffect(() => {
    if (!allowInput) return;
    const inputEl = inputRef.current?.inputElement;
    if (!inputEl) return;
    // autoWidth 且存在自定义元素时需要撑开宽度
    if (!autoWidth || !showCustomElement || !customElementRef.current) {
      inputEl.style.minWidth = '';
      return;
    }
    const el = customElementRef.current;
    // 测量真实内容宽度时，临时强制 nowrap，避免被父级容器（受 suffixSpace 影响）压缩换行导致测量值偏小
    const prevWhiteSpace = el.style.whiteSpace;
    el.style.whiteSpace = 'nowrap';
    const { width } = el.getBoundingClientRect();
    el.style.whiteSpace = prevWhiteSpace;
    inputEl.style.minWidth = width > 0 ? `${width}px` : '';
  }, [allowInput, autoWidth, showCustomElement, singleValueDisplay]);

  useEffect(() => {
    if (!allowInput) return;
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
  }, [allowInput, showCustomElement, singleValueDisplay, clearable, suffixIcon, props.suffix]);

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

    const sharedInputProps = {
      ref: inputRef,
      ...commonInputProps,
      autocomplete: 'off' as const,
      autoWidth,
      style: inputProps?.style,
      onChange: onInnerInputChange,
      onClear: onInnerClear,
      onFocus: handleFocus,
      onEnter: (val, context) => {
        props.onEnter?.(value, { ...context, inputValue: val });
      },
      onBlur: handleBlur,
      ...inputProps,
      inputClass: classNames(inputProps?.inputClass, {
        [`${classPrefix}-input--focused`]: popupVisible,
        [`${classPrefix}-is-focused`]: popupVisible,
      }),
    };

    // allowInput=false 时直接将选中内容放进 label，不需要 absolute
    // (历史实现，避免 DOM 结构变更，保留原有逻辑，大版本可考虑彻底统一)
    const isStaticValueDisplay = !allowInput && Boolean(valueDisplay);

    if (isStaticValueDisplay) {
      return (
        <Input
          {...sharedInputProps}
          showClearIconOnEmpty={clearable}
          allowInput={false}
          label={
            (label || singleValueDisplay) && (
              <>
                {label}
                {singleValueDisplay as React.ReactNode}
              </>
            )
          }
          value=" "
          placeholder=""
        />
      );
    }

    const displayedValue = (): string => {
      if (inputProps?.value !== undefined) {
        return inputProps.value;
      }
      if (popupVisible && inputValue) {
        return inputValue;
      }
      if (allowInput && popupVisible && !showCustomElement) {
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
      return inputProps?.placeholder ?? props.placeholder;
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
          opacity: popupVisible && allowInput ? 0.5 : undefined,
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
        {...sharedInputProps}
        // 当 valueDisplay 为 自定义元素时，选中内容时 input 依旧为空，确保此时 clear icon 可见
        showClearIconOnEmpty={clearable && showCustomElement}
        suffix={
          labelNode ||
          (commonInputProps.suffix && (
            <>
              {labelNode}
              {commonInputProps.suffix}
            </>
          ))
        }
        allowInput={allowInput}
        label={label}
        value={displayedValue()}
        placeholder={displayedPlaceholder()}
        onCompositionstart={(v, ctx) => {
          setIsTyping(true);
          inputProps?.onCompositionstart?.(v, ctx);
        }}
        onCompositionend={(v, ctx) => {
          setIsTyping(false);
          inputProps?.onCompositionend?.(v, ctx);
        }}
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
