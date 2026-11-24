import type { ChangeEvent, CompositionEvent, CSSProperties, FocusEvent, InputEvent, TouchEvent } from 'react';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isFunction } from 'lodash-es';
import { BrowseIcon, BrowseOffIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';
import useDefault from '../_util/useDefault';
import parseTNode from '../_util/parseTNode';
import { inputDefaultProps } from './defaultProps';
import { getCharacterLength } from '../_common/js/utils/helper';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';
import { TdInputProps } from './type';
import { StyledProps } from '../common';
import withNativeProps from '../_util/withNativeProps';

export interface InputProps extends TdInputProps, StyledProps {
  required?: boolean;
  readonly?: boolean;
}

export interface InputRefProps {
  focus?: () => void;
  blur?: () => void;
}

const Input = forwardRef<InputRefProps, InputProps>((props, ref) => {
  const {
    align,
    autofocus,
    autocomplete,
    borderless,
    clearable,
    clearTrigger,
    enterkeyhint,
    disabled,
    format,
    label,
    layout,
    maxlength,
    name,
    placeholder,
    prefixIcon,
    spellcheck,
    suffix,
    suffixIcon,
    tips,
    type,
    readonly,
    extra,
    cursorColor,
    onBlur,
    onClear,
    onFocus,
    value,
    defaultValue,
    onChange,
  } = useDefaultProps(props, inputDefaultProps);

  const [innerValue, setInnerValue] = useDefault(value, defaultValue, onChange);
  const [composingValue, setComposingValue] = useState<string>('');
  const [renderType, setRenderType] = useState(type);
  const inputRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);
  const status = props.status || 'default';
  const { classPrefix } = useConfig();
  const rootClassName = `${classPrefix}-input`;
  const inputClasses = classNames(`${rootClassName}__control`, {
    [`${rootClassName}--${align}`]: align !== 'left',
    [`${rootClassName}--${status}`]: status,
    [`${rootClassName}__control--disabled`]: disabled,
    [`${rootClassName}--password`]: renderType === 'password',
  });
  const rootClasses = classNames(`${rootClassName}`, {
    [`${rootClassName}--layout-${layout}`]: layout,
    [`${rootClassName}--border`]: !borderless,
  });
  const resultMaxLength = !isNaN(+maxlength) ? +maxlength : -1;

  useImperativeHandle(ref, () => ({
    focus,
    blur,
  }));

  const showClear = useMemo<boolean>(() => {
    if (disabled || readonly) {
      return false;
    }
    if (clearable) {
      return clearTrigger === 'always' || (clearTrigger === 'focus' && focused);
    }
    return false;
  }, [clearTrigger, clearable, disabled, focused, readonly]);

  useEffect(() => {
    if (autofocus) {
      focus();
    }
  }, [autofocus]);

  useEffect(() => {
    setRenderType(type);
  }, [type]);

  function focus() {
    setFocused(true);
    inputRef.current?.focus();
  }

  function blur() {
    setFocused(false);
    inputRef.current?.blur();
  }

  const handleInputValue = (
    e: ChangeEvent<HTMLInputElement> | CompositionEvent<HTMLInputElement> | InputEvent<HTMLInputElement>,
  ) => {
    const target = e.currentTarget || (e.target as HTMLInputElement);
    const { value } = target;
    const { allowInputOverMax, maxcharacter } = props;

    // 如果允许超出最大输入限制，直接更新值并返回
    if (allowInputOverMax) {
      return value;
    }

    // 根据不同的限制条件处理输入值
    let finalValue = value;

    // 处理maxcharacter限制（优先级高于maxlength）
    if (maxcharacter && !Number.isNaN(maxcharacter)) {
      const { characters } = getCharacterLength(value, maxcharacter) as {
        length: number;
        characters: string;
      };
      finalValue = characters;
    }
    // 处理maxlength限制
    else if (resultMaxLength > 0 && value.length > resultMaxLength) {
      finalValue = value.slice(0, resultMaxLength);
    }

    return finalValue;
  };

  const handleInput = (e: InputEvent<HTMLInputElement>) => {
    const finalValue = handleInputValue(e);
    // 中文输入的时候 inputType 是 insertCompositionText 所以中文输入的时候禁止触发。
    if (e.nativeEvent.isComposing || e.nativeEvent.inputType === 'insertCompositionText') {
      composingRef.current = true;
      setComposingValue(finalValue);
      return;
    }

    setInnerValue(finalValue, { e, trigger: 'input' });
  };

  const handleClear = (e: TouchEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInnerValue('', { e, trigger: 'clear' });
    focus();
    onClear?.({ e });
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(innerValue, { e });
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    // 失焦时处理 format
    if (isFunction(format)) {
      setInnerValue(format(innerValue), { e, trigger: 'blur' });
    }

    onBlur?.(innerValue, { e });
  };

  const handleCompositionend = (e: CompositionEvent<HTMLInputElement>) => {
    const finalValue = handleInputValue(e);
    composingRef.current = false;
    // 更新输入值
    setInnerValue(finalValue, { e, trigger: 'input' });
  };

  const handlePwdIconClick = () => {
    if (disabled) {
      return;
    }
    setRenderType((renderType) => (renderType === 'password' ? 'text' : 'password'));
  };

  const renderPrefix = () => (
    <div className={`${rootClassName}__wrap--prefix`}>
      {prefixIcon ? <div className={`${rootClassName}__icon--prefix`}></div> : null}
      <div className={`${rootClassName}__label`}>{parseTNode(label)}</div>
    </div>
  );

  const renderExtra = () => parseTNode(extra);

  const renderClearable = () =>
    showClear ? (
      <div className={`${rootClassName}__wrap--clearable-icon`} onTouchEnd={handleClear}>
        <CloseCircleFilledIcon />
      </div>
    ) : null;

  const renderSuffix = () =>
    suffix ? <div className={`${rootClassName}__wrap--suffix`}>{parseTNode(suffix)}</div> : null;

  const renderSuffixIcon = () => {
    let tempSuffixIcon = suffixIcon;
    if (type === 'password') {
      if (renderType === 'password') {
        tempSuffixIcon = <BrowseOffIcon onClick={handlePwdIconClick} />;
      } else if (renderType === 'text') {
        tempSuffixIcon = <BrowseIcon onClick={handlePwdIconClick} />;
      }
    }
    return suffixIcon ? <div className={`${rootClassName}__wrap--suffix-icon`}>{tempSuffixIcon}</div> : null;
  };

  const renderTips = () =>
    tips ? <div className={`${rootClassName}__tips ${rootClassName}--${align}`}>{parseTNode(tips)}</div> : null;

  const style: CSSProperties = {
    '--td-input-cursor-color': cursorColor,
  } as any;

  const finalValue = composingRef.current ? composingValue : (innerValue ?? '');

  return withNativeProps(
    props,
    <div className={rootClasses}>
      {renderPrefix()}
      <div className={`${rootClassName}__wrap`}>
        <div className={`${rootClassName}__content ${rootClassName}--${status}`}>
          <input
            ref={inputRef}
            autoFocus={autofocus}
            value={finalValue}
            name={name}
            className={inputClasses}
            type={renderType}
            disabled={disabled}
            autoComplete={autocomplete}
            placeholder={placeholder}
            readOnly={readonly}
            enterKeyHint={enterkeyhint}
            spellCheck={spellcheck}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleInput}
            onCompositionEnd={handleCompositionend}
            style={style}
          />
          {renderClearable()}
          {renderSuffix()}
          {renderSuffixIcon()}
        </div>
        {renderTips()}
      </div>
      {renderExtra()}
    </div>,
  );
});

Input.displayName = 'Input';

export default Input;
