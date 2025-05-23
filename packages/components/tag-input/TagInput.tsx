import React, { CompositionEvent, KeyboardEvent, useRef, useImperativeHandle, forwardRef, MouseEvent } from 'react';
import { CloseCircleFilledIcon as TdCloseCircleFilledIcon } from 'tdesign-icons-react';
import { isFunction } from 'lodash-es';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useDragSorter from '../hooks/useDragSorter';
import TInput, { InputValue, InputRef } from '../input';
import { TdTagInputProps } from './type';
import useTagScroll from './useTagScroll';
import useTagList from './useTagList';
import useHover from './useHover';
import useControlled from '../hooks/useControlled';
import { StyledProps } from '../common';
import { tagInputDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';

export interface TagInputProps extends TdTagInputProps, StyledProps {
  options?: any[]; // 参数穿透options, 给SelectInput/SelectInput 自定义选中项呈现的内容和多选状态下设置折叠项内容
}

const TagInput = forwardRef<InputRef, TagInputProps>((originalProps, ref) => {
  const props = useDefaultProps<TagInputProps>(originalProps, tagInputDefaultProps);
  const { classPrefix: prefix } = useConfig();
  const { CloseCircleFilledIcon } = useGlobalIcon({
    CloseCircleFilledIcon: TdCloseCircleFilledIcon,
  });

  const {
    excessTagsDisplayType,
    autoWidth,
    borderless,
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
    prefixIcon,
    maxRows,
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
  const { tagValue, onClose, onInnerEnter, onInputBackspaceKeyUp, clearAll, renderLabel, onInputBackspaceKeyDown } =
    useTagList({
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

  const onInputEnter = (value: InputValue, context: { e: KeyboardEvent<HTMLInputElement> }) => {
    setTInputValue('', { e: context.e, trigger: 'enter' });
    !isCompositionRef.current && onInnerEnter(value, context);
    scrollToRight();
  };

  const onInnerClick = (context: { e: MouseEvent<HTMLDivElement> }) => {
    if (!props.disabled && !props.readonly) {
      (tagInputRef.current as any)?.inputElement?.focus?.();
    }
    onClick?.(context);
  };

  const onClearClick = (e: MouseEvent<SVGSVGElement>) => {
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
        onClose: (index) => onClose({ index }),
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
      [`${prefix}-tag-input--max-rows`]: excessTagsDisplayType === 'break-line' && maxRows,
      [`${prefix}-tag-input--drag-sort`]: props.dragSort && !disabled && !readonly,
    },
    props.className,
  ];

  const maxRowsStyle = maxRows
    ? ({
        '--max-rows': maxRows,
        '--tag-input-size': size,
      } as React.CSSProperties)
    : {};

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
      borderless={borderless}
      readonly={readonly}
      disabled={disabled}
      label={renderLabel({ displayNode, label })}
      className={classnames(classes)}
      style={{
        ...props.style,
        ...maxRowsStyle,
      }}
      tips={tips}
      status={status}
      placeholder={tagInputPlaceholder}
      suffix={suffix}
      prefixIcon={prefixIcon}
      suffixIcon={suffixIconNode}
      showInput={!inputProps?.readonly || !tagValue || !tagValue?.length}
      keepWrapperWidth={!autoWidth}
      onPaste={onPaste}
      onClick={onInnerClick}
      onEnter={onInputEnter}
      onKeydown={onInputBackspaceKeyDown}
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
        if (tInputValue) {
          setTInputValue('', { e: context.e, trigger: 'blur' });
        }
        onBlur?.(tagValue, { e: context.e, inputValue: '' });
      }}
      onCompositionstart={onInputCompositionstart}
      onCompositionend={onInputCompositionend}
      {...inputProps}
    />
  );
});

TagInput.displayName = 'TagInput';

export default TagInput;
