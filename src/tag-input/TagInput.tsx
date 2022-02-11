import React, { useState, KeyboardEvent, useImperativeHandle, forwardRef } from 'react';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import useConfig from '../_util/useConfig';
import TInput, { InputValue } from '../input';
import { TdTagInputProps } from './type';
import useTagScroll from './useTagScroll';
import useTagList from './useTagList';
import useHover from './useHover';
import { StyledProps } from '../common';

export interface TagInputProps extends TdTagInputProps, StyledProps {}

const TagInput = forwardRef((props: TagInputProps, ref) => {
  const { classPrefix: prefix } = useConfig();
  const [tInputValue, setTInputValue] = useState<InputValue>();

  const {
    excessTagsDisplayType = 'scroll',
    readonly,
    disabled,
    clearable,
    placeholder,
    valueDisplay,
    label,
    inputProps,
    size,
    tips,
    status,
    suffixIcon,
    suffix,
    onPaste,
    onFocus,
    onBlur,
  } = props;

  const { isHover, addHover, cancelHover } = useHover(props);

  const { scrollToRight, onWheel, scrollToRightOnEnter, scrollToLeftOnLeave, tagInputRef } = useTagScroll(props);

  // handle tag add and remove
  const { tagValue, onInnerEnter, onInputBackspaceKeyUp, clearAll, renderLabel } = useTagList(props);

  const NAME_CLASS = `${prefix}-tag-input`;
  const CLEAR_CLASS = `${prefix}-tag-input__suffix-clear`;
  const BREAK_LINE_CLASS = `${prefix}-tag-input--break-line`;

  const classes = [
    NAME_CLASS,
    {
      [BREAK_LINE_CLASS]: excessTagsDisplayType === 'break-line',
    },
  ];

  const tagInputPlaceholder = isHover || !tagValue?.length ? placeholder : '';

  const showClearIcon = Boolean(!readonly && !disabled && clearable && isHover && tagValue?.length);

  useImperativeHandle(ref, () => ({ ...(tagInputRef.current || {}) }));

  const onInputEnter = (value: InputValue, context: { e: KeyboardEvent<HTMLDivElement> }) => {
    setTInputValue('');
    onInnerEnter(value, context);
    scrollToRight();
  };

  const suffixIconNode = showClearIcon ? (
    <CloseCircleFilledIcon className={CLEAR_CLASS} onClick={(e) => clearAll({ e })} />
  ) : (
    suffixIcon
  );
  // 自定义 Tag 节点
  const displayNode = isFunction(valueDisplay) ? valueDisplay({ value: tagValue }) : valueDisplay;

  return (
    <TInput
      ref={tagInputRef}
      {...inputProps}
      value={tInputValue}
      onChange={(val: InputValue) => {
        setTInputValue(val);
      }}
      onWheel={onWheel}
      size={size}
      readonly={readonly}
      disabled={disabled}
      label={() => renderLabel({ displayNode, label })}
      className={classnames(classes)}
      tips={tips}
      status={status}
      placeholder={tagInputPlaceholder}
      suffix={suffix}
      suffixIcon={suffixIconNode}
      onPaste={onPaste}
      onEnter={onInputEnter}
      onKeyup={onInputBackspaceKeyUp}
      onMouseenter={(context) => {
        addHover(context);
        scrollToRightOnEnter();
      }}
      onMouseleave={(context) => {
        cancelHover(context);
        scrollToLeftOnLeave();
      }}
      onFocus={(inputValue, context) => {
        onFocus?.(tagValue, { e: context.e, inputValue });
      }}
      onBlur={(inputValue, context) => {
        onBlur?.(tagValue, { e: context.e, inputValue });
      }}
    />
  );
});

TagInput.displayName = 'TagInput';

export default TagInput;
