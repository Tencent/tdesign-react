import React, { useState, useRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import { isFunction } from 'lodash';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import useConfig from '../_util/useConfig';
import { TdInputProps, InputValue } from './type';
import { StyledProps, TNode } from '../common';
import InputGroup from './InputGroup';
import useDefaultValue from '../_util/useDefaultValue';

export interface InputProps extends TdInputProps, StyledProps {
  onCompositionStart?: Function;
  onCompositionEnd?: Function;
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

  if (result) {
    result = <span className={`${classPrefix}-input__${type}`}>{result}</span>;
  }

  return result;
};

const Input = forwardRefWithStatics(
  (props: InputProps, ref) => {
    const {
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
      onChange,
      onClear,
      onEnter,
      onKeydown,
      onFocus,
      onBlur,
      onPaste,
      onCompositionStart,
      onCompositionEnd,
      autofocus,
      readonly,
      label,
      suffix,
      ...restProps
    } = useDefaultValue<InputValue, InputProps>(props, '');

    const { classPrefix } = useConfig();
    const composingRef = useRef(false);
    const inputRef: React.RefObject<HTMLInputElement> = useRef();
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

    // tips 会引起 dom 变动，抽离透传属性
    const wrapperProps = { style, ref: wrapperRef };

    const renderInput = (
      <input
        ref={inputRef}
        {...inputProps}
        {...eventProps}
        className={classNames(inputProps.className, `${classPrefix}-input__inner`)}
        value={composingRef.current ? composingRefValue : value}
        readOnly={readonly}
        disabled={disabled}
        autoFocus={autofocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
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
        })}
        onMouseEnter={() => toggleIsHover(true)}
        onMouseLeave={() => toggleIsHover(false)}
      >
        {prefixIconContent}
        {labelContent ? <div className={`${classPrefix}-input__prefix`}>{labelContent}</div> : null}
        {renderInput}
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
    function handleCompositionStart(e: React.CompositionEvent<HTMLInputElement>) {
      composingRef.current = true;
      const {
        currentTarget: { value },
      } = e;
      onCompositionStart?.(value, { e });
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
      onCompositionEnd?.(value, { e });
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
