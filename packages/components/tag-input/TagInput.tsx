import React, {
  CompositionEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { CloseCircleFilledIcon as TdCloseCircleFilledIcon } from 'tdesign-icons-react';
import classnames from 'classnames';
import { isFunction } from 'lodash-es';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import useDragSorter from '../hooks/useDragSorter';
import useGlobalIcon from '../hooks/useGlobalIcon';
import TInput, { type InputRef, type InputValue } from '../input';
import { tagInputDefaultProps } from './defaultProps';
import useHover from './useHover';
import useTagList from './useTagList';
import useTagScroll from './useTagScroll';

import type { TdTagInputProps } from './type';
import type { StyledProps } from '../common';

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
  const readOnly = props.readOnly || props.readonly;

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

  const showClearIcon = Boolean(!readOnly && !disabled && clearable && isHover && tagValue?.length);

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

  const onKeydown = (value: string, context: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    onInputBackspaceKeyDown(value, context);
    inputProps?.onKeydown?.(value, context);
  };

  const onKeyup = (value: string, context: { e: React.KeyboardEvent<HTMLInputElement> }) => {
    onInputBackspaceKeyUp(value);
    inputProps?.onKeyup?.(value, context);
  };

  const suffixIconNode = showClearIcon ? (
    <CloseCircleFilledIcon className={CLEAR_CLASS} onClick={onClearClick} />
  ) : (
    suffixIcon
  );

  // 自定义 Tag 节点
  const displayNode = useMemo(
    () =>
      isFunction(valueDisplay)
        ? valueDisplay({
            value: tagValue,
            onClose: (index) => onClose({ index }),
          })
        : valueDisplay,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [valueDisplay],
  );

  const isEmpty = !(Array.isArray(tagValue) && tagValue.length);

  const classes = [
    NAME_CLASS,
    {
      [BREAK_LINE_CLASS]: excessTagsDisplayType === 'break-line',
      [WITH_SUFFIX_ICON_CLASS]: !!suffixIconNode,
      [`${prefix}-is-empty`]: isEmpty,
      [`${prefix}-tag-input--with-tag`]: !isEmpty,
      [`${prefix}-tag-input--max-rows`]: excessTagsDisplayType === 'break-line' && maxRows,
      [`${prefix}-tag-input--drag-sort`]: props.dragSort && !disabled && !readOnly,
    },
    props.className,
  ];

  const maxRowsStyle = maxRows
    ? ({
        '--max-rows': maxRows,
        '--tag-input-size': size,
      } as React.CSSProperties)
    : {};

    console.log('>>', inputProps?.readOnly, inputProps?.readonly);
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
      readOnly={readOnly}
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
      // showInput={!inputProps?.readOnly || !inputProps?.readonly || !tagValue || !tagValue?.length}
      showInput={!inputProps?.readonly || !tagValue || !tagValue?.length}
      keepWrapperWidth={!autoWidth}
      onPaste={onPaste}
      onClick={onInnerClick}
      onEnter={onInputEnter}
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
        onBlur?.(tagValue, { e: context.e, inputValue });
      }}
      onCompositionstart={onInputCompositionstart}
      onCompositionend={onInputCompositionend}
      {...inputProps}
      onKeydown={onKeydown}
      onKeyup={onKeyup}
    />
  );
});

TagInput.displayName = 'TagInput';

export default TagInput;
