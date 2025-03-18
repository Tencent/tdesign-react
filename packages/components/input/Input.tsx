import React, { useState, useRef, useImperativeHandle, useEffect, useMemo, useCallback } from 'react';
import classNames from 'classnames';
import {
  BrowseIcon as TdBrowseIcon,
  BrowseOffIcon as TdBrowseOffIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-react';
import { isFunction } from 'lodash-es';
import useLayoutEffect from '../hooks/useLayoutEffect';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { TdInputProps } from './type';
import { StyledProps, TNode, TElement } from '../common';
import InputGroup from './InputGroup';
import useControlled from '../hooks/useControlled';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { inputDefaultProps } from './defaultProps';
import parseTNode from '../_util/parseTNode';
import useLengthLimit from './useLengthLimit';
import useDefaultProps from '../hooks/useDefaultProps';

export interface InputProps extends TdInputProps, StyledProps {
  showInput?: boolean; // 控制透传readonly同时是否展示input 默认保留 因为正常Input需要撑开宽度
  keepWrapperWidth?: boolean; // 控制透传autoWidth之后是否容器宽度也自适应 多选等组件需要用到自适应但也需要保留宽度
}

export interface InputRef extends React.RefObject<unknown> {
  currentElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  focus: () => void;
  blur: () => void;
  select: () => void;
}

type InputContextTrigger = 'input' | 'clear' | 'initial';

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode | TElement) => {
  const result = parseTNode(icon);
  const iconClassName = icon ? `${classPrefix}-input__${type}-icon` : '';

  return result ? <span className={`${classPrefix}-input__${type} ${iconClassName}`}>{result}</span> : null;
};

const Input = forwardRefWithStatics(
  (originalProps: InputProps, ref: React.RefObject<InputRef>) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('input');
    const { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } = useGlobalIcon({
      BrowseIcon: TdBrowseIcon,
      BrowseOffIcon: TdBrowseOffIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });
    const props = useDefaultProps<InputProps>(originalProps, inputDefaultProps);
    const {
      type,
      autoWidth,
      borderless,
      placeholder = t(local.placeholder),
      disabled,
      status,
      size,
      className,
      inputClass,
      style,
      prefixIcon,
      suffixIcon,
      clearable,
      tips,
      align,
      maxlength,
      maxcharacter,
      showClearIconOnEmpty,
      autofocus,
      autocomplete,
      readonly,
      label,
      suffix,
      showInput = true,
      keepWrapperWidth,
      showLimitNumber,
      allowInput,
      allowInputOverMax,
      name,
      format,
      onClick,
      onClear,
      onEnter,
      onKeydown,
      onKeyup,
      onKeypress,
      onFocus,
      onBlur,
      onPaste,
      onMouseenter,
      onMouseleave,
      onWheel,
      onCompositionstart,
      onCompositionend,
      onValidate,
      onChange: onChangeFromProps,
      ...restProps
    } = props;

    const [value, onChange] = useControlled(props, 'value', onChangeFromProps);
    const { limitNumber, getValueByLimitNumber, tStatus } = useLengthLimit({
      value: value === undefined ? undefined : String(value),
      status,
      maxlength,
      maxcharacter,
      allowInputOverMax,
      onValidate,
    });

    const { classPrefix } = useConfig();
    const composingRef = useRef(false);
    const inputRef: React.RefObject<HTMLInputElement> = useRef();
    // inputPreRef 用于预存输入框宽度，应用在 auto width 模式中
    const inputPreRef: React.RefObject<HTMLInputElement> = useRef();
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef();
    const [isHover, toggleIsHover] = useState(false);
    const [isFocused, toggleIsFocused] = useState(false);
    const [renderType, setRenderType] = useState(type);

    const [composingValue, setComposingValue] = useState<string>('');

    // 组件内部 input 原生控件是否处于 readonly 状态，当整个组件 readonly 时，或者处于不可输入时
    const isInnerInputReadonly = useMemo(() => readonly || !allowInput, [allowInput, readonly]);

    // 是否展示清除图标
    const isShowClearIcon = useMemo(
      () => ((clearable && value) || showClearIconOnEmpty) && !disabled && !readonly && isHover,
      [clearable, disabled, isHover, readonly, showClearIconOnEmpty, value],
    );

    // 前缀图标
    const prefixIconContent = useMemo(
      () => renderIcon(classPrefix, 'prefix', parseTNode(prefixIcon)),
      [classPrefix, prefixIcon],
    );

    // 添加MouseDown阻止冒泡，防止點擊Clear value會導致彈窗閃爍一下
    // https://github.com/Tencent/tdesign-react/issues/2320
    const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
      e.stopPropagation();
      // 兼容React16
      e.nativeEvent.stopImmediatePropagation();
    }, []);

    const handleClear = useCallback(
      (e: React.MouseEvent<SVGSVGElement>) => {
        onChange?.('', { e, trigger: 'clear' });
        onClear?.({ e });
      },
      [onChange, onClear],
    );

    const togglePasswordVisible = useCallback(() => {
      if (disabled) return;
      const toggleType = renderType === 'password' ? 'text' : 'password';
      setRenderType(toggleType);
    }, [disabled, renderType]);

    const suffixIconNew = useMemo(() => {
      let resultSuffixIcon = suffixIcon;

      if (isShowClearIcon)
        resultSuffixIcon = (
          <CloseCircleFilledIcon
            className={`${classPrefix}-input__suffix-clear`}
            onMouseDown={handleMouseDown}
            onClick={handleClear}
          />
        );
      if (type === 'password' && typeof suffixIcon === 'undefined') {
        if (renderType === 'password') {
          resultSuffixIcon = (
            <BrowseOffIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />
          );
        } else if (renderType === 'text') {
          resultSuffixIcon = (
            <BrowseIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />
          );
        }
      }

      return resultSuffixIcon;
    }, [
      BrowseIcon,
      BrowseOffIcon,
      CloseCircleFilledIcon,
      classPrefix,
      handleClear,
      handleMouseDown,
      isShowClearIcon,
      renderType,
      suffixIcon,
      togglePasswordVisible,
      type,
    ]);

    const suffixIconContent = useMemo(
      () => renderIcon(classPrefix, 'suffix', parseTNode(suffixIconNew)),
      [classPrefix, suffixIconNew],
    );
    const labelContent = useMemo(() => (isFunction(label) ? label() : label), [label]);
    const suffixContent = useMemo(() => (isFunction(suffix) ? suffix() : suffix), [suffix]);
    const limitNumberNode = useMemo(
      () =>
        limitNumber && showLimitNumber ? (
          <div
            className={classNames(`${classPrefix}-input__limit-number`, {
              [`${classPrefix}-is-disabled`]: disabled,
            })}
          >
            {limitNumber}
          </div>
        ) : null,
      [classPrefix, disabled, limitNumber, showLimitNumber],
    );

    const updateInputWidth = () => {
      if (!autoWidth || !inputRef.current) return;
      const { offsetWidth } = inputPreRef.current;
      const { width } = inputPreRef.current.getBoundingClientRect();
      // 异步渲染场景下 getBoundingClientRect 宽度为 0，需要使用 offsetWidth
      const calcWidth = width < offsetWidth ? offsetWidth + 1 : width;
      inputRef.current.style.width = `${calcWidth}px`;
    };

    useLayoutEffect(() => {
      // 推迟到下一帧处理防止异步渲染 input 场景宽度计算为 0
      requestAnimationFrame(() => {
        updateInputWidth();
      });
      // eslint-disable-next-line
    }, [autoWidth, value, placeholder, inputRef, composingValue]);

    // 当元素默认为 display: none 状态，无法提前准确计算宽度，因此需要监听元素宽度变化。比如：Tabs 场景切换。
    useEffect(() => {
      let resizeObserver: ResizeObserver = null;
      // IE 11 以下使用设置 minWidth 兼容；IE 11 以上使用 ResizeObserver
      if (typeof window.ResizeObserver === 'undefined' || !inputRef.current) return;
      resizeObserver = new window.ResizeObserver(() => {
        updateInputWidth();
      });
      resizeObserver.observe(inputRef.current);
      return () => {
        // resizeObserver.unobserve?.(inputRef.current);
        resizeObserver.disconnect?.();
        resizeObserver = null;
      };
      // eslint-disable-next-line
    }, [inputRef]);

    useEffect(() => {
      setRenderType(type);
    }, [type]);

    // 初始判断长度，如超限自动截断并触发onchange
    useEffect(() => {
      if (value) {
        const limitedValue = getValueByLimitNumber(value);
        if (limitedValue.length !== value.length && !allowInputOverMax) {
          onChange?.(limitedValue, { trigger: 'initial' });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const innerValue = composingRef.current ? composingValue : value ?? '';
    const formatDisplayValue = format && !isFocused ? format(innerValue) : innerValue;

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (isInnerInputReadonly) return;
        const {
          currentTarget: { value },
        } = e;
        onFocus?.(value, { e });
        toggleIsFocused(true);
      },
      [isInnerInputReadonly, onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (isInnerInputReadonly) return;
        const {
          currentTarget: { value },
        } = e;
        onBlur?.(value, { e });
        toggleIsFocused(false);
      },
      [isInnerInputReadonly, onBlur],
    );

    const handleChange = useCallback(
      (
        e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>,
        trigger: InputContextTrigger = 'input',
      ) => {
        let { value: newStr } = e.currentTarget;
        if (composingRef.current) {
          setComposingValue(newStr);
        } else {
          if (props.type !== 'number') {
            newStr = getValueByLimitNumber(newStr);
          }
          // 完成中文输入时同步一次 composingValue
          setComposingValue(newStr);
          onChange(newStr, { e, trigger });
        }
      },
      [getValueByLimitNumber, onChange, props.type],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const {
          key,
          currentTarget: { value },
        } = e;
        key === 'Enter' && onEnter?.(value, { e });
        onKeydown?.(value, { e });
      },
      [onEnter, onKeydown],
    );

    const handleKeyUp = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const {
          currentTarget: { value },
        } = e;
        onKeyup?.(value, { e });
      },
      [onKeyup],
    );

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        const {
          currentTarget: { value },
        } = e;
        onKeypress?.(value, { e });
      },
      [onKeypress],
    );

    const handleCompositionStart = useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        composingRef.current = true;
        const {
          currentTarget: { value },
        } = e;
        onCompositionstart?.(value, { e });
      },
      [onCompositionstart],
    );

    const handleCompositionEnd = useCallback(
      (e: React.CompositionEvent<HTMLInputElement>) => {
        const {
          currentTarget: { value },
        } = e;
        if (composingRef.current) {
          composingRef.current = false;
          handleChange(e);
        }
        onCompositionend?.(value, { e });
      },
      [handleChange, onCompositionend],
    );

    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLInputElement>) => {
        const clipData = e.clipboardData;
        const pasteValue = clipData?.getData('text/plain');
        onPaste?.({ e, pasteValue });
      },
      [onPaste],
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        toggleIsHover(true);
        onMouseenter?.({ e });
      },
      [onMouseenter],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        toggleIsHover(false);
        onMouseleave?.({ e });
      },
      [onMouseleave],
    );

    const renderInput = useMemo(
      () => (
        <input
          ref={inputRef}
          placeholder={placeholder}
          type={renderType}
          className={`${classPrefix}-input__inner`}
          value={formatDisplayValue}
          readOnly={isInnerInputReadonly}
          disabled={disabled}
          autoComplete={autocomplete ?? (local.autocomplete || undefined)}
          autoFocus={autofocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onKeyPress={handleKeyPress}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPaste={handlePaste}
          name={name}
        />
      ),
      [
        autocomplete,
        autofocus,
        classPrefix,
        disabled,
        formatDisplayValue,
        handleBlur,
        handleChange,
        handleCompositionEnd,
        handleCompositionStart,
        handleFocus,
        handleKeyDown,
        handleKeyPress,
        handleKeyUp,
        handlePaste,
        isInnerInputReadonly,
        local.autocomplete,
        name,
        placeholder,
        renderType,
      ],
    );

    const renderInputNode = useMemo(
      () => (
        <div
          className={classNames(inputClass, `${classPrefix}-input`, {
            [`${classPrefix}-is-readonly`]: readonly,
            [`${classPrefix}-is-disabled`]: disabled,
            [`${classPrefix}-is-focused`]: isFocused,
            [`${classPrefix}-size-s`]: size === 'small',
            [`${classPrefix}-size-l`]: size === 'large',
            [`${classPrefix}-align-${align}`]: align,
            [`${classPrefix}-is-${tStatus}`]: tStatus && tStatus !== 'default',
            [`${classPrefix}-input--prefix`]: prefixIcon || labelContent,
            [`${classPrefix}-input--suffix`]: suffixIconContent || suffixContent,
            [`${classPrefix}-input--borderless`]: borderless,
            [`${classPrefix}-input--focused`]: isFocused,
          })}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onWheel={(e) => onWheel?.({ e })}
          onClick={(e) => {
            inputRef.current?.focus();
            onClick?.({ e });
          }}
        >
          {prefixIconContent}
          {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
          {showInput && renderInput}
          {autoWidth && (
            <span ref={inputPreRef} className={`${classPrefix}-input__input-pre`}>
              {innerValue || placeholder}
            </span>
          )}
          {suffixContent || limitNumberNode ? (
            <div className={`${classPrefix}-input__suffix`}>
              {suffixContent}
              {limitNumberNode}
            </div>
          ) : null}
          {suffixIconContent}
        </div>
      ),
      [
        align,
        autoWidth,
        borderless,
        classPrefix,
        disabled,
        handleMouseEnter,
        handleMouseLeave,
        innerValue,
        inputClass,
        isFocused,
        labelContent,
        limitNumberNode,
        onClick,
        onWheel,
        placeholder,
        prefixIcon,
        prefixIconContent,
        readonly,
        renderInput,
        showInput,
        size,
        suffixContent,
        suffixIconContent,
        tStatus,
      ],
    );

    useImperativeHandle(ref as InputRef, () => ({
      currentElement: wrapperRef.current,
      inputElement: inputRef.current,
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      select: () => inputRef.current?.select(),
    }));

    return (
      <div
        ref={wrapperRef}
        style={style}
        className={classNames(`${classPrefix}-input__wrap`, className, {
          [`${classPrefix}-input--auto-width`]: autoWidth && !keepWrapperWidth,
        })}
        {...restProps}
      >
        {renderInputNode}
        {tips && (
          <div
            className={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${tStatus || 'default'}`)}
          >
            {tips}
          </div>
        )}
      </div>
    );
  },
  { Group: InputGroup },
);

Input.displayName = 'Input';

export default Input;
