import React, { forwardRef, useState, useEffect, useMemo, useRef, useCallback, useImperativeHandle } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import { TdTextareaProps } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';
import useControlled from '../hooks/useControlled';
import { getCharacterLength } from '../_util/helper';
import calcTextareaHeight from '../_common/js/utils/calcTextareaHeight';
import { textareaDefaultProps } from './defaultProps';

export interface TextareaProps extends TdTextareaProps, StyledProps {}
export interface TextareaRefInterface extends React.RefObject<unknown> {
  currentElement: HTMLDivElement;
  textareaElement: HTMLTextAreaElement;
}

const Textarea = forwardRef((props: TextareaProps, ref: TextareaRefInterface) => {
  const {
    disabled,
    maxlength,
    maxcharacter,
    className,
    readonly,
    autofocus,
    style,
    onKeydown = noop,
    onKeypress = noop,
    onKeyup = noop,
    autosize,
    status,
    tips,
    allowInputOverMax,
    ...otherProps
  } = props;

  const [value = '', setValue] = useControlled(props, 'value', props.onChange);
  const [isFocused, setIsFocused] = useState(false);
  const [isOvermax, setIsOvermax] = useState(false);
  const [textareaStyle, setTextareaStyle] = useState({});
  const hasMaxcharacter = typeof maxcharacter !== 'undefined';
  const textareaRef: React.RefObject<HTMLTextAreaElement> = useRef();
  const wrapperRef: React.RefObject<HTMLDivElement> = useRef();
  const currentLength = useMemo(() => (value ? String(value).length : 0), [value]);
  const characterLength = useMemo(() => {
    const characterInfo = getCharacterLength(String(value), allowInputOverMax ? Infinity : maxcharacter);
    if (typeof characterInfo === 'object') return characterInfo.length;
    return characterInfo;
  }, [value, allowInputOverMax, maxcharacter]);

  const { classPrefix } = useConfig();

  const textareaPropsNames = Object.keys(otherProps).filter((key) => !/^on[A-Z]/.test(key));
  const textareaProps = textareaPropsNames.reduce(
    (textareaProps, key) => Object.assign(textareaProps, { [key]: props[key] }),
    {},
  );
  const eventPropsNames = Object.keys(otherProps).filter((key) => /^on[A-Z]/.test(key));
  const eventProps = eventPropsNames.reduce((eventProps, key) => {
    Object.assign(eventProps, {
      [key]: (e) => {
        if (disabled) return;
        if (key === 'onFocus') setIsFocused(true);
        if (key === 'onBlur') setIsFocused(false);
        props[key](e.currentTarget.value, { e });
      },
    });
    return eventProps;
  }, {});

  const textareaClassNames = classNames(`${classPrefix}-textarea__inner`, className, {
    [`${classPrefix}-is-${status}`]: status,
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-focused`]: isFocused,
    [`${classPrefix}-resize-none`]: typeof autosize === 'object',
  });

  const adjustTextareaHeight = useCallback(() => {
    if (autosize === true) {
      setTextareaStyle(calcTextareaHeight(textareaRef.current));
    } else if (typeof autosize === 'object') {
      setTextareaStyle(calcTextareaHeight(textareaRef.current, autosize?.minRows, autosize?.maxRows));
    }
  }, [autosize]);

  function inputValueChangeHandle(e: React.FormEvent<HTMLTextAreaElement>) {
    const { target } = e;
    let val = (target as HTMLInputElement).value;
    if (!allowInputOverMax && maxcharacter && maxcharacter >= 0) {
      const stringInfo = getCharacterLength(val, maxcharacter);
      val = typeof stringInfo === 'object' && stringInfo.characters;
    }
    setValue(val, { e });
  }

  const renderLimitText = (current: number, max: number) => (
    <span className={`${classPrefix}-textarea__limit`}>
      {isOvermax ? <span className={`${classPrefix}-textarea__tips--warning`}> {current}</span> : `${current}`}
      {`/${max}`}
    </span>
  );

  useEffect(() => {
    // 当未设置 autosize 时，需要将 textarea 的 height 设置为 auto，以支持原生的 textarea rows 属性
    if (autosize === false) {
      setTextareaStyle({ height: 'auto', minHeight: 'auto' });
    }
  }, [adjustTextareaHeight, autosize]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight, value]);

  useEffect(() => {
    if (allowInputOverMax) {
      setIsOvermax(!!(maxlength && currentLength > maxlength) || !!(maxcharacter && characterLength > maxcharacter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterLength]);

  useImperativeHandle(ref as TextareaRefInterface, () => ({
    currentElement: wrapperRef.current,
    textareaElement: textareaRef.current,
  }));

  return (
    <div style={style} ref={wrapperRef} className={classNames(`${classPrefix}-textarea`, className)}>
      <textarea
        {...textareaProps}
        {...eventProps}
        value={value}
        style={textareaStyle}
        className={textareaClassNames}
        readOnly={readonly}
        autoFocus={autofocus}
        disabled={disabled}
        maxLength={allowInputOverMax ? Infinity : maxlength}
        onChange={inputValueChangeHandle}
        onKeyDown={(e) => onKeydown(e.currentTarget.value, { e })}
        onKeyPress={(e) => onKeypress(e.currentTarget.value, { e })}
        onKeyUp={(e) => onKeyup(e.currentTarget.value, { e })}
        ref={textareaRef}
      />
      {hasMaxcharacter && renderLimitText(characterLength, maxcharacter)}
      {!hasMaxcharacter && maxlength && renderLimitText(currentLength, maxlength)}
      {tips ? (
        <div
          className={classNames(`${classPrefix}-textarea__tips`, {
            [`${classPrefix}-textarea__tips--normal`]: !status,
            [`${classPrefix}-textarea__tips--${status}`]: status,
          })}
        >
          {tips}
        </div>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
Textarea.defaultProps = textareaDefaultProps;

export default Textarea;
