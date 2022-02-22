import React, { useState, useRef, useImperativeHandle, useEffect } from 'react';
import classNames from 'classnames';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import isFunction from 'lodash/isFunction';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../_util/useConfig';
import { TdInputProps, InputValue } from './type';
import { StyledProps, TNode } from '../common';
import InputGroup from './InputGroup';
import useDefaultValue from '../_util/useDefaultValue';

export interface InputProps extends TdInputProps, StyledProps {}

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

  const iconClassName = icon ? `${classPrefix}-input__suffix-icon` : '';

  if (result) {
    result = <span className={`${classPrefix}-input__${type} ${iconClassName}`}>{result}</span>;
  }

  return result;
};

const Input = forwardRefWithStatics(
  (props: InputProps, ref) => {
    const {
      autoWidth,
      placeholder,
      disabled,
      status,
      size,
      className,
      style,
      prefixIcon,
      suffixIcon,
      clearable,
      value,
      tips,
      align,
      onClick,
      onChange,
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
      autofocus,
      readonly,
      label,
      suffix,
      ...restProps
    } = useDefaultValue<InputValue, InputProps>(props, '');

    const { classPrefix } = useConfig();
    const composingRef = useRef(false);
    const inputRef: React.RefObject<HTMLInputElement> = useRef();
    // inputPreRef 用于预存输入框宽度，应用在 auto width 模式中
    const inputPreRef: React.RefObject<HTMLInputElement> = useRef();
    const wrapperRef: React.RefObject<HTMLDivElement> = useRef();
    const [isHover, toggleIsHover] = useState(false);
    const [isFocused, toggleIsFocused] = useState(false);

    const [composingRefValue, setComposingValue] = useState<string>('');
    const isShowClearIcon = clearable && value && !disabled && isHover;

    const prefixIconContent = renderIcon(classPrefix, 'prefix', prefixIcon);
    const suffixIconNew = isShowClearIcon ? (
      <CloseCircleFilledIcon className={`${classPrefix}-input__suffix-clear`} onClick={handleClear} />
    ) : (
      suffixIcon
    );
    const suffixIconContent = renderIcon(classPrefix, 'suffix', suffixIconNew);
    const labelContent = isFunction(label) ? label() : label;
    const suffixContent = isFunction(suffix) ? suffix() : suffix;

    const inputPropsNames = Object.keys(restProps).filter((key) => !/^on[A-Z]/.test(key));
    const inputProps = inputPropsNames.reduce((inputProps, key) => Object.assign(inputProps, { [key]: props[key] }), {
      className: '',
    });
    const eventPropsNames = Object.keys(restProps).filter((key) => /^on[A-Z]/.test(key));
    const eventProps = eventPropsNames.reduce((eventProps, key) => {
      Object.assign(eventProps, {
        [key]: (e: any) => props[key](e.currentTarget.value, { e }),
      });
      return eventProps;
    }, {});

    useEffect(() => {
      if (!autoWidth) return;
      inputRef.current.style.width = `${inputPreRef.current.offsetWidth}px`;
    }, [autoWidth, value, placeholder]);

    // tips 会引起 dom 变动，抽离透传属性
    const wrapperProps = { style, ref: wrapperRef };

    const renderInput = (
      <input
        ref={inputRef}
        placeholder={placeholder}
        {...inputProps}
        {...eventProps}
        className={classNames(inputProps.className, `${classPrefix}-input__inner`)}
        value={composingRef.current ? composingRefValue : value}
        readOnly={readonly}
        disabled={disabled}
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
      />
    );

    const renderInputNode = (
      <div
        {...wrapperProps}
        className={classNames(tips ? '' : className, `${classPrefix}-input`, {
          [`${classPrefix}-is-readonly`]: readonly,
          [`${classPrefix}-is-disabled`]: disabled,
          [`${classPrefix}-is-focused`]: isFocused,
          [`${classPrefix}-size-s`]: size === 'small',
          [`${classPrefix}-size-l`]: size === 'large',
          [`${classPrefix}-align-${align}`]: align,
          [`${classPrefix}-is-${status}`]: status,
          [`${classPrefix}-input--prefix`]: prefixIcon || labelContent,
          [`${classPrefix}-input--suffix`]: suffixIconContent || suffixContent,
          [`${classPrefix}-input--focused`]: isFocused,
          [`${classPrefix}-input--auto-width`]: autoWidth,
        })}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onClick={(e) => onClick?.({ e })}
      >
        {prefixIconContent}
        {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
        {renderInput}
        {autoWidth && (
          <span ref={inputPreRef} className={`${classPrefix}-input__input-pre`}>
            {value || props.placeholder}
          </span>
        )}
        {suffixContent ? <div className={`${classPrefix}-input__suffix`}>{suffixContent}</div> : null}
        {suffixIconContent}
      </div>
    );

    function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.CompositionEvent<HTMLInputElement>) {
      const { value } = e.currentTarget;
      if (composingRef.current) {
        setComposingValue(value);
      } else {
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
      setComposingValue('');
      onCompositionend?.(value, { e });
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
      onFocus?.(value, { e });
      toggleIsFocused(true);
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      const {
        currentTarget: { value },
      } = e;
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

    if (tips) {
      return (
        <div {...wrapperProps} className={classNames(className, `${classPrefix}-input__wrap`)}>
          {renderInputNode}
          <div
            className={classNames(`${classPrefix}-input__tips`, `${classPrefix}-input__tips--${status || 'normal'}`)}
          >
            {tips}
          </div>
        </div>
      );
    }

    return renderInputNode;
  },
  { Group: InputGroup },
);

Input.displayName = 'Input';

export default Input;
