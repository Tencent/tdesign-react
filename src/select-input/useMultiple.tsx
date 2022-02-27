import React, { useRef, MouseEvent } from 'react';
import isObject from 'lodash/isObject';
import { TdSelectInputProps, SelectInputChangeContext, SelectInputKeys } from './type';
import TagInput, { TagInputValue } from '../tag-input';
import { SelectInputCommonProperties } from './interface';
import useDefaultValue from '../_util/useDefault';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent<SVGElement> }) => void;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

export default function useMultiple(props: TdSelectInputProps) {
  const { value } = props;
  const tagInputRef = useRef();
  const [tInputValue, setTInputValue] = useDefaultValue(props.inputValue, props.defaultInputValue, props.onInputChange);
  const iKeys: SelectInputKeys = { ...DEFAULT_KEYS, ...props.keys };

  const getTags = () => {
    if (!(value instanceof Array)) {
      return isObject(value) ? [value[iKeys.label]] : [value];
    }
    return value.map((item) => (isObject(item) ? item[iKeys.label] : item));
  };
  const tags = getTags();

  const tPlaceholder = !tags || !tags.length ? props.placeholder : '';

  const onTagInputChange = (val: TagInputValue, context: SelectInputChangeContext) => {
    // 避免触发浮层的显示或隐藏
    if (context.trigger === 'tag-remove') {
      context.e?.stopPropagation();
    }
    props.onTagChange?.(val, context);
  };

  const renderSelectMultiple = (p: RenderSelectMultipleParams) => (
    <TagInput
      ref={tagInputRef}
      {...p.commonInputProps}
      readonly={!props.allowInput}
      autoWidth={props.borderless || props.autoWidth}
      minCollapsedNum={props.minCollapsedNum}
      collapsedItems={props.collapsedItems}
      tag={props.tag}
      valueDisplay={props.valueDisplay}
      placeholder={tPlaceholder}
      value={tags}
      inputValue={tInputValue || ''}
      onChange={onTagInputChange}
      onInputChange={(val, context) => {
        // 筛选器统一特性：筛选器按下回车时不清空输入框
        if (context?.trigger === 'enter') return;
        setTInputValue(val, { trigger: context.trigger, e: context.e });
      }}
      tagProps={props.tagProps}
      onClear={p.onInnerClear}
      onBlur={(val, context) => {
        props.onBlur?.(props.value, { ...context, tagInputValue: val });
        // 筛选器统一特性：失去焦点时，清空输入内容
        setTInputValue('', { ...context, trigger: 'blur' });
      }}
      onFocus={(val, context) => {
        props.onFocus?.(props.value, { ...context, tagInputValue: val });
      }}
      {...props.tagInputProps}
    />
  );

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    renderSelectMultiple,
  };
}
