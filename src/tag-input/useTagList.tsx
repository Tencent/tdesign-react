import React, { useState, MouseEvent, KeyboardEvent, ReactNode, Fragment } from 'react';
import isFunction from 'lodash/isFunction';
import { TagInputChangeContext, TagInputValue, TdTagInputProps } from './type';
import { InputValue } from '../input';
import Tag from '../tag';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import { DragSortInnerProps } from '../_util/useDragSorter';

export type ChangeParams = [TagInputChangeContext];

interface TagInputProps extends TdTagInputProps, DragSortInnerProps {}

// handle tag add and remove
export default function useTagList(props: TagInputProps) {
  const { classPrefix: prefix } = useConfig();
  const { onRemove, max, minCollapsedNum, size, disabled, readonly, tagProps, tag, collapsedItems, getDragProps } =
    props;
  // handle controlled property and uncontrolled property
  const [tagValue, setTagValue] = useControlled(props, 'value', props.onChange);
  const [oldInputValue, setOldInputValue] = useState<InputValue>();

  // 点击标签关闭按钮，删除标签
  const onClose = (p: { e?: MouseEvent<SVGSVGElement>; index: number; item: string | number }) => {
    const arr = [...tagValue];
    arr.splice(p.index, 1);
    setTagValue(arr, { trigger: 'tag-remove', ...p });
    onRemove?.({ ...p, trigger: 'tag-remove', value: arr });
  };

  const clearAll = (context: { e: MouseEvent<SVGSVGElement> }) => {
    setTagValue([], { trigger: 'clear', e: context.e });
  };

  // 按下 Enter 键，新增标签
  const onInnerEnter = (value: InputValue, context: { e: KeyboardEvent<HTMLInputElement> }) => {
    const valueStr = value ? String(value).trim() : '';
    let newValue: TagInputValue = tagValue;
    const isLimitExceeded = max && tagValue?.length >= max;
    if (valueStr && !isLimitExceeded) {
      newValue = tagValue instanceof Array ? tagValue.concat(String(valueStr)) : [valueStr];
      setTagValue(newValue, {
        trigger: 'enter',
        index: newValue.length - 1,
        item: valueStr,
        e: context.e,
      });
    }
    props?.onEnter?.(newValue, { ...context, inputValue: value });
  };

  const onInputBackspaceKeyUp = (value: InputValue) => {
    if (!tagValue || !tagValue.length) return;
    setOldInputValue(value);
  };
  // 按下回退键，删除标签
  const onInputBackspaceKeyDown = (value: InputValue, context: { e: KeyboardEvent<HTMLInputElement> }) => {
    const { e } = context;
    if (!tagValue || !tagValue.length) return;
    // 回车键删除，输入框值为空时，才允许 Backspace 删除标签
    if (!oldInputValue && ['Backspace', 'NumpadDelete'].includes(e.key)) {
      const index = tagValue.length - 1;
      const item = tagValue[index];
      const trigger = 'backspace';
      const newValue = tagValue.slice(0, -1);
      setTagValue(newValue, { e, index, item, trigger });
      onRemove?.({ e, index, item, trigger, value: newValue });
    }
  };

  const renderLabel = ({ displayNode, label }: { displayNode: ReactNode; label: ReactNode }) => {
    const newList = minCollapsedNum ? tagValue.slice(0, minCollapsedNum) : tagValue;
    const list = displayNode
      ? [<Fragment key="display-node">{displayNode}</Fragment>]
      : newList?.map((item, index) => {
          const tagContent = isFunction(tag) ? tag({ value: item }) : tag;
          return (
            <Tag
              key={index}
              size={size}
              disabled={disabled}
              onClose={(context) => onClose({ e: context.e, item, index })}
              closable={!readonly && !disabled}
              {...getDragProps?.(index, item)}
              {...tagProps}
            >
              {tagContent ?? item}
            </Tag>
          );
        });
    if (label) {
      list?.unshift(
        <div className={`${prefix}-tag-input__prefix`} key="label">
          {label}
        </div>,
      );
    }
    // 超出省略
    if (newList.length !== tagValue.length) {
      const len = tagValue.length - newList.length;
      const params = {
        value: tagValue,
        count: tagValue.length - minCollapsedNum,
        collapsedTags: tagValue.slice(minCollapsedNum, tagValue.length),
      };
      const more = isFunction(collapsedItems) ? collapsedItems(params) : collapsedItems;
      list.push(<Fragment key="more">{more ?? <Tag>+{len}</Tag>}</Fragment>);
    }
    return list;
  };

  return {
    tagValue,
    clearAll,
    onClose,
    onInnerEnter,
    onInputBackspaceKeyDown,
    onInputBackspaceKeyUp,
    renderLabel,
  };
}
