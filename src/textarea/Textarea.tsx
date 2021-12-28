import React, { forwardRef, useState, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import useConfig from '../_util/useConfig';
import { TdTextareaProps } from './type';
import { StyledProps } from '../common';
import noop from '../_util/noop';

export interface TextareaProps extends TdTextareaProps, StyledProps {
  onCompositionStart?: Function;
  onCompositionEnd?: Function;
}

const Textarea = forwardRef((props: TextareaProps, ref: React.Ref<HTMLInputElement>) => {
  const {
    disabled,
    maxlength,
    className,
    readonly,
    value,
    style,
    onKeydown = noop,
    onKeypress = noop,
    onKeyup = noop,
    onChange = noop,
    onCompositionStart,
    onCompositionEnd,
    autosize = false,
    ...otherProps
  } = props;

  const composingRef = useRef(false);
  const [composingRefValue, setComposingValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState(false);
  const [currentLength, setCurrentLength] = useState(() => {
    if (typeof value !== 'undefined') {
      return String(value).length;
    }
    if (typeof props.defaultValue !== 'undefined') {
      return String(props.defaultValue).length;
    }
    return 0;
  });

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

  const textareaClassNames = classNames(className, `${classPrefix}-textarea__inner`, {
    [`${classPrefix}-is-disabled`]: disabled,
    [`${classPrefix}-is-focused`]: isFocused,
    [`${classPrefix}-resize-none`]: maxlength,
  });

  function handleChange(e) {
    const { value } = e.currentTarget;
    setCurrentLength(value.length);
    if (composingRef.current) {
      setComposingValue(value);
    } else {
      onChange(value, { e });
    }
  }

  function handleCompositionStart(event: React.CompositionEvent<HTMLTextAreaElement>) {
    composingRef.current = true;
    isFunction(onCompositionStart) && onCompositionStart(event);
  }
  function handleCompositionEnd(event: React.CompositionEvent<HTMLTextAreaElement>) {
    if (composingRef.current) {
      composingRef.current = false;
      handleChange(event);
    }
    setComposingValue('');
    isFunction(onCompositionEnd) && onCompositionEnd(event);
  }

  // 当未设置 autosize 时，需要将 textarea 的 height 设置为 auto，以支持原生的 textarea rows 属性
  return (
    <div ref={ref} style={style} className={classNames(className, `${classPrefix}-textarea`)}>
      <textarea
        {...textareaProps}
        {...eventProps}
        value={composingRef.current ? composingRefValue : value}
        style={{
          height: Array.isArray(autosize) || autosize ? null : 'auto',
        }}
        className={textareaClassNames}
        readOnly={readonly}
        disabled={disabled}
        maxLength={maxlength}
        onChange={handleChange}
        onKeyDown={(e) => onKeydown(e.currentTarget.value, { e })}
        onKeyPress={(e) => onKeypress(e.currentTarget.value, { e })}
        onKeyUp={(e) => onKeyup(e.currentTarget.value, { e })}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
      />
      {maxlength ? <span className={`${classPrefix}-textarea__limit`}>{`${currentLength}/${maxlength}`}</span> : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
