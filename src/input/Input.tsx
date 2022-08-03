import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import classNames from 'classnames';
import {
  BrowseIcon as TdBrowseIcon,
  BrowseOffIcon as TdBrowseOffIcon,
  CloseCircleFilledIcon as TdCloseCircleFilledIcon,
} from 'tdesign-icons-react';
import isFunction from 'lodash/isFunction';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { getCharacterLength } from '../_util/helper';
import { TdInputProps } from './type';
import { StyledProps, TNode } from '../common';
import InputGroup from './InputGroup';
import useControlled from '../hooks/useControlled';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { inputDefaultProps } from './defaultProps';

export interface InputProps extends TdInputProps, StyledProps {
  showInput?: boolean; // 控制透传readonly同时是否展示input 默认保留 因为正常Input需要撑开宽度
  keepWrapperWidth?: boolean; // 控制透传autoWidth之后是否容器宽度也自适应 多选等组件需要用到自适应但也需要保留宽度
}

export interface InputRefInterface extends React.RefObject<unknown> {
  currentElement: HTMLDivElement;
  inputElement: HTMLInputElement;
  focus: () => void;
  blur: () => void;
  select: () => void;
}

const renderIcon = (classPrefix: string, type: 'prefix' | 'suffix', icon: TNode) => {
  let result: React.ReactNode = null;

  if (icon) result = icon;

  if (typeof icon === 'function') result = icon();

  const iconClassName = icon ? `${classPrefix}-input__${type}-icon` : '';

  if (result) {
    result = <span className={`${classPrefix}-input__${type} ${iconClassName}`}>{result}</span>;
  }

  return result;
};

const Input = forwardRefWithStatics(
  (props: InputProps, ref) => {
    // 国际化文本初始化
    const [local, t] = useLocaleReceiver('input');
    const { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } = useGlobalIcon({
      BrowseIcon: TdBrowseIcon,
      BrowseOffIcon: TdBrowseOffIcon,
      CloseCircleFilledIcon: TdCloseCircleFilledIcon,
    });
    const {
      type,
      autoWidth,
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
      onChange: onChangeFromProps,
      ...restProps
    } = props;

    const [value, onChange] = useControlled(props, 'value', onChangeFromProps);

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
    const isShowClearIcon = ((clearable && value && !disabled) || showClearIconOnEmpty) && isHover;

    const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
    let suffixIconNew = suffixIcon;

    if (isShowClearIcon)
      suffixIconNew = <CloseCircleFilledIcon className={`${classPrefix}-input__suffix-clear`} onClick={handleClear} />;
    if (type === 'password' && typeof suffixIcon === 'undefined') {
      if (renderType === 'password') {
        suffixIconNew = (
          <BrowseOffIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />
        );
      } else if (renderType === 'text') {
        suffixIconNew = <BrowseIcon className={`${classPrefix}-input__suffix-clear`} onClick={togglePasswordVisible} />;
      }
    }

    const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIconNew);
    const labelContent = isFunction(label) ? label() : label;
    const suffixContent = isFunction(suffix) ? suffix() : suffix;

    useEffect(() => {
      if (!autoWidth) return;
      if (inputPreRef.current?.offsetWidth === 0) return;
      if (inputRef.current) inputRef.current.style.width = `${inputPreRef.current?.offsetWidth}px`;
    }, [autoWidth, value, placeholder, inputRef]);

    useEffect(() => {
      setRenderType(type);
    }, [type]);

    const renderInput = (
      <input
        ref={inputRef}
        placeholder={placeholder}
        type={renderType}
        className={`${classPrefix}-input__inner`}
        value={composingRef.current ? composingValue : value ?? ''}
        readOnly={readonly}
        disabled={disabled}
        autoComplete={autocomplete ?? (local.autocomplete || undefined)}
        autoFocus={autofocus}
        maxLength={maxlength}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
    );

    const renderInputNode = (
      <div
        className={classNames(inputClass, `${classPrefix}-input`, {
          [`${classPrefix}-is-readonly`]: readonly,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: isFocused,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-size-m`]: size === 'medium',
          [`${classPrefix}-align-${align}`]: align,
          [`${classPrefix}-is-${status}`]: status,
          [`${classPrefix}-input--prefix`]: prefixIcon || labelContent,
          [`${classPrefix}-input--suffix`]: suffixIconContent || suffixContent,
          [`${classPrefix}-input--focused`]: isFocused,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onClick={(e) => onClick?.({ e })}
      >
        {prefixIconContent}
        {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
        {showInput && renderInput}
        {autoWidth && (
          <span ref={inputPreRef} className={`${classPrefix}-input__input-pre`}>
            {value || props.placeholder}
          </span>
        )}
        {suffixContent ? <div className={`${classPrefix}-input__suffix`}>{suffixContent}</div> : null}
        {suffixIconContent}
      </div>
    );

    function togglePasswordVisible() {
      const toggleType = renderType === 'password' ? 'text' : 'password';
      setRenderType(toggleType);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>) {
      let { value } = e.currentTarget;
      if (composingRef.current) {
        setComposingValue(value);
      } else {
        if (typeof maxcharacter === 'number' && maxcharacter >= 0) {
          const stringInfo = getCharacterLength(value, maxcharacter);
          value = typeof stringInfo === 'object' && stringInfo.characters;
        }
        onChange(value, { e });
      }
    }
    function handleClear(e: React.MouseEvent<SVGSVGElement>) {
      onChange?.('', { e });
      onClear?.({ e });
    }
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        key,
        currentTarget: { value },
      } = e;
      key === 'Enter' && onEnter?.(value, { e });
      onKeydown?.(value, { e });
    }
    function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      onKeyup?.(value, { e });
    }
    function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      onKeypress?.(value, { e });
    }
    function handleCompositionStart(e: React.CompositionEvent<HTMLInputElement>) {
      composingRef.current = true;
      const {
        currentTarget: { value },
      } = e;
      onCompositionstart?.(value, { e });
    }
    function handleCompositionEnd(e: React.CompositionEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      if (composingRef.current) {
        composingRef.current = false;
        handleChange(e);
      }
      onCompositionend?.(value, { e });
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      if (readonly) return;
      const {
        currentTarget: { value },
      } = e;
      onFocus?.(value, { e });
      toggleIsFocused(true);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      if (readonly) return;
      const {
        currentTarget: { value },
      } = e;
      format && onChange(format(value), { e });
      onBlur?.(value, { e });
      toggleIsFocused(false);
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
      const clipData = e.clipboardData;
      const pasteValue = clipData?.getData('text/plain');
      onPaste?.({ e, pasteValue });
    }

    function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
      toggleIsHover(true);
      onMouseenter?.({ e });
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
      toggleIsHover(false);
      onMouseleave?.({ e });
    }

    function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
      onWheel?.({ e });
    }

    useImperativeHandle(ref as InputRefInterface, () => ({
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
            className={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${status || 'normal'}`)}
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
Input.defaultProps = inputDefaultProps;

export default Input;
