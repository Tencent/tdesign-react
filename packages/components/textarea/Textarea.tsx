import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import calcTextareaHeight from '@tdesign/common-js/utils/calcTextareaHeight';
import { getCharacterLength, getUnicodeLength, limitUnicodeMaxLength } from '@tdesign/common-js/utils/helper';
import noop from '../_util/noop';
import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useEventCallback from '../hooks/useEventCallback';
import useIsomorphicLayoutEffect from '../hooks/useLayoutEffect';
import { textareaDefaultProps } from './defaultProps';

import type { StyledProps } from '../common';
import type { TdTextareaProps } from './type';

const DEFAULT_TEXTAREA_STYLE = { height: 'auto', minHeight: 'auto' };

export interface TextareaProps
  extends Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      'value' | 'defaultValue' | 'onBlur' | 'onChange' | 'onFocus' | 'onKeyDown' | 'onKeyPress' | 'onKeyUp'
    >,
    TdTextareaProps,
    StyledProps {}
export interface TextareaRefInterface {
  currentElement: HTMLDivElement;
  textareaElement: HTMLTextAreaElement;
}

const Textarea = forwardRef<TextareaRefInterface, TextareaProps>((originalProps, ref) => {
  const props = useDefaultProps<TextareaProps>(originalProps, textareaDefaultProps);
  const {
    count,
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
    rows,
    ...otherProps
  } = props;
  const hasMaxcharacter = typeof maxcharacter !== 'undefined';

  const [value = '', setValue] = useControlled(props, 'value', props.onChange);

  const [isFocused, setIsFocused] = useState(false);
  const [isOvermax, setIsOvermax] = useState(false);
  const [textareaStyle, setTextareaStyle] = useState<Partial<typeof DEFAULT_TEXTAREA_STYLE>>(DEFAULT_TEXTAREA_STYLE);
  const [composingValue, setComposingValue] = useState<string>('');

  const composingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const currentLength = useMemo(() => getUnicodeLength(value), [value]);
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
    [`${classPrefix}-hide-scrollbar`]: autosize === true,
  });

  const adjustTextareaHeight = useEventCallback(() => {
    if (autosize === true) {
      setTextareaStyle(calcTextareaHeight(textareaRef.current));
    } else if (typeof autosize === 'object') {
      setTextareaStyle(calcTextareaHeight(textareaRef.current, autosize?.minRows, autosize?.maxRows));
    }
  });

  const handleAutoFocus = useEventCallback(() => {
    requestAnimationFrame(() => {
      if (autofocus && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.focus();
        // 将光标移到内容的末尾
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;
      }
    });
  });

  function inputValueChangeHandle(e: React.FormEvent<HTMLTextAreaElement>) {
    const { target } = e;
    let val = (target as HTMLInputElement).value;

    if (composingRef.current) {
      setComposingValue(val);
    } else {
      if (!allowInputOverMax) {
        val = limitUnicodeMaxLength(val, maxlength);
        if (maxcharacter && maxcharacter >= 0) {
          const stringInfo = getCharacterLength(val, maxcharacter);
          val = typeof stringInfo === 'object' && stringInfo.characters;
        }
      }
      setComposingValue(val);
      setValue(val, { e });
    }
  }

  function handleCompositionStart() {
    composingRef.current = true;
  }

  function handleCompositionEnd(e: React.FormEvent<HTMLTextAreaElement>) {
    if (composingRef.current) {
      composingRef.current = false;
      inputValueChangeHandle(e);
    }
  }

  const renderLimitText = (current: number, max: number) => {
    if (count === false) return null;

    // 不设置 maxLength 或 maxCharacter，也支持渲染自定义节点
    if (typeof count === 'function') {
      return parseTNode(count, {
        value,
        count: current,
        maxLength: hasMaxcharacter ? undefined : maxlength,
        maxCharacter: hasMaxcharacter ? maxcharacter : undefined,
      });
    }

    if (!max) return;
    return (
      <span className={`${classPrefix}-textarea__limit`}>
        {isOvermax && allowInputOverMax ? (
          <span className={`${classPrefix}-textarea__tips--warning`}> {current}</span>
        ) : (
          `${current}`
        )}
        {`/${max}`}
      </span>
    );
  };

  useIsomorphicLayoutEffect(() => {
    if (autosize === false) {
      setTextareaStyle(DEFAULT_TEXTAREA_STYLE);
    } else {
      adjustTextareaHeight();
    }
  }, [value, autosize, adjustTextareaHeight]);

  useEffect(() => {
    handleAutoFocus();
    adjustTextareaHeight();
  }, [handleAutoFocus, adjustTextareaHeight]);

  useEffect(() => {
    if (allowInputOverMax) {
      setIsOvermax(!!(maxlength && currentLength > maxlength) || !!(maxcharacter && characterLength > maxcharacter));
    }
  }, [allowInputOverMax, characterLength, currentLength, maxcharacter, maxlength]);

  useImperativeHandle(ref, () => ({
    currentElement: wrapperRef.current,
    textareaElement: textareaRef.current,
  }));

  const textTips = tips && (
    <div
      className={classNames(`${classPrefix}-textarea__tips`, {
        [`${classPrefix}-textarea__tips--normal`]: !status,
        [`${classPrefix}-textarea__tips--${status}`]: status,
      })}
    >
      {tips}
    </div>
  );

  const limitText = renderLimitText(currentLength, maxlength ?? maxcharacter);

  return (
    <div style={style} ref={wrapperRef} className={classNames(`${classPrefix}-textarea`, className)}>
      <textarea
        {...textareaProps}
        {...eventProps}
        rows={rows}
        value={composingRef.current ? composingValue : value}
        style={textareaStyle}
        className={textareaClassNames}
        readOnly={readonly}
        autoFocus={autofocus}
        disabled={disabled}
        onChange={inputValueChangeHandle}
        onKeyDown={(e) => onKeydown(e.currentTarget.value, { e })}
        onKeyPress={(e) => onKeypress(e.currentTarget.value, { e })}
        onKeyUp={(e) => onKeyup(e.currentTarget.value, { e })}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        ref={textareaRef}
      />
      {textTips || limitText ? (
        <div
          className={classNames(`${classPrefix}-textarea__info_wrapper`, {
            [`${classPrefix}-textarea__info_wrapper_align`]: !textTips,
          })}
        >
          {textTips}
          {limitText}
        </div>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
