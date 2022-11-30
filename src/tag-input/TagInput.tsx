import React, { CompositionEvent, KeyboardEvent, useRef, useImperativeHandle, forwardRef, MouseEvent } from 'react';
import { CloseCircleFilledIcon as TdCloseCircleFilledIcon } from 'tdesign-icons-react';
import isFunction from 'lodash/isFunction';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useDragSorter from '../_util/useDragSorter';
import TInput, { InputValue, InputRef } from '../input';
import { TdTagInputProps } from './type';
import useTagScroll from './useTagScroll';
import useTagList from './useTagList';
import useHover from './useHover';
import useControlled from '../hooks/useControlled';
import { StyledProps } from '../common';
import { tagInputDefaultProps } from './defaultProps';

export interface TagInputProps extends TdTagInputProps, StyledProps {}

const TagInput = forwardRef((props: TagInputProps, ref: React.RefObject<InputRef>) => {
  const { classPrefix: prefix } = useConfig();
  const { CloseCircleFilledIcon } = useGlobalIcon({
    CloseCircleFilledIcon: TdCloseCircleFilledIcon,
  });

  const {
    excessTagsDisplayType,
    autoWidth,
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
    onClick,
    onPaste,
    onFocus,
    onBlur,
  } = props;

  const [tInputValue, setTInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const { isHover, addHover, cancelHover } = useHover(props);
  const { getDragProps } = useDragSorter({
    ...props,
    sortOnDraggable: props.dragSort,
    onDragOverCheck: {
      x: true,
      targetClassNameRegExp: new RegExp(`^${prefix}-tag`),
    },
  });
  const isCompositionRef = useRef(false);

  const { scrollToRight, onWheel, scrollToRightOnEnter, scrollToLeftOnLeave, tagInputRef } = useTagScroll(props);

  // handle tag add and remove
  const { tagValue, onClose, onInnerEnter, onInputBackspaceKeyUp, clearAll, renderLabel } = useTagList({
    ...props,
    getDragProps,
  });

  const NAME_CLASS = `${prefix}-tag-input`;
  const WITH_SUFFIX_ICON_CLASS = `${prefix}-tag-input__with-suffix-icon`;
  const CLEAR_CLASS = `${prefix}-tag-input__suffix-clear`;
  const BREAK_LINE_CLASS = `${prefix}-tag-input--break-line`;

  const tagInputPlaceholder = !tagValue?.length ? placeholder : '';

  const showClearIcon = Boolean(!readonly && !disabled && clearable && isHover && tagValue?.length);

  useImperativeHandle(ref as InputRef, () => ({ ...(tagInputRef.current || {}) }));

  const onInputCompositionstart = (value: InputValue, context: { e: CompositionEvent<HTMLInputElement> }) => {
    isCompositionRef.current = true;
    inputProps?.onCompositionstart?.(value, context);
  };

  const onInputCompositionend = (value: InputValue, context: { e: CompositionEvent<HTMLInputElement> }) => {
    isCompositionRef.current = false;
    inputProps?.onCompositionend?.(value, context);
  };

  const onInputEnter = (value: InputValue, context: { e: KeyboardEvent<HTMLDivElement> }) => {
    setTInputValue('', { e: context.e, trigger: 'enter' });
    !isCompositionRef.current && onInnerEnter(value, context);
    scrollToRight();
  };

  const onInnerClick = (context: { e: MouseEvent<HTMLDivElement> }) => {
    (tagInputRef.current as any).inputElement?.focus?.();
    onClick?.(context);
  };

  const onClearClick = (e: MouseEvent<SVGElement>) => {
    clearAll({ e });
    setTInputValue('', { e, trigger: 'clear' });
    props.onClear?.({ e });
  };

  const suffixIconNode = showClearIcon ? (
    <CloseCircleFilledIcon className={CLEAR_CLASS} onClick={onClearClick} />
  ) : (
    suffixIcon
  );
  // 自定义 Tag 节点
  const displayNode = isFunction(valueDisplay)
    ? valueDisplay({
        value: tagValue,
        onClose: (index, item) => onClose({ index, item }),
      })
    : valueDisplay;

  const isEmpty = !(Array.isArray(tagValue) && tagValue.length);

  const classes = [
    NAME_CLASS,
    {
      [BREAK_LINE_CLASS]: excessTagsDisplayType === 'break-line',
      [WITH_SUFFIX_ICON_CLASS]: !!suffixIconNode,
      [`${prefix}-is-empty`]: isEmpty,
      [`${prefix}-tag-input--with-tag`]: !isEmpty,
    },
    props.className,
  ];

  return (
    <TInput
      ref={tagInputRef as React.RefObject<InputRef>}
      value={tInputValue}
      onChange={(val, context) => {
        setTInputValue(val, { ...context, trigger: 'input' });
      }}
      autoWidth={true} // 控制input_inner的宽度 设置为true让内部input不会提前换行
      onWheel={onWheel}
      size={size}
      readonly={readonly}
      disabled={disabled}
      label={renderLabel({ displayNode, label })}
      className={classnames(classes)}
      style={props.style}
      tips={tips}
      status={status}
      placeholder={tagInputPlaceholder}
      suffix={suffix}
      suffixIcon={suffixIconNode}
      showInput={!inputProps?.readonly || !tagValue || !tagValue?.length}
      keepWrapperWidth={!autoWidth}
      onPaste={onPaste}
      onClick={onInnerClick}
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
      onCompositionstart={onInputCompositionstart}
      onCompositionend={onInputCompositionend}
      {...inputProps}
    />
  );
});

TagInput.displayName = 'TagInput';
TagInput.defaultProps = tagInputDefaultProps;

export default TagInput;
