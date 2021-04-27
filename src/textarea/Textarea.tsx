import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdTextareaProps } from '../_type/components/textarea';
import { StyledProps } from '../_type';
import noop from '../_util/noop';

export interface TextareaProps extends TdTextareaProps, StyledProps {}

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
    ...otherProps
  } = props;

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
    setCurrentLength(e.currentTarget.value.length);

    onChange(e.currentTarget.value, { e });
  }

  return (
    <div ref={ref} style={style} className={classNames(className, `${classPrefix}-textarea`)}>
      <textarea
        {...textareaProps}
        {...eventProps}
        value={value}
        className={textareaClassNames}
        readOnly={readonly}
        disabled={disabled}
        maxLength={maxlength}
        onChange={handleChange}
        onKeyDown={(e) => onKeydown(e.currentTarget.value, { e })}
        onKeyPress={(e) => onKeypress(e.currentTarget.value, { e })}
        onKeyUp={(e) => onKeyup(e.currentTarget.value, { e })}
      ></textarea>
      {maxlength ? <span className={`${classPrefix}-textarea__limit`}>{`${currentLength}/${maxlength}`}</span> : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
