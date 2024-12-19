import React, { useRef, MouseEvent } from 'react';
import isObject from 'lodash/isObject';
import classNames from 'classnames';
import { TdSelectInputProps, SelectInputChangeContext, SelectInputKeys, SelectInputValue } from './type';
import TagInput, { TagInputValue } from '../tag-input';
import { SelectInputCommonProperties } from './interface';
import useControlled from '../hooks/useControlled';
import useConfig from '../hooks/useConfig';
import { InputRef } from '../input';
import { StyledProps } from '../common';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  onInnerClear: (context: { e: MouseEvent<SVGElement> }) => void;
  popupVisible: boolean;
  allowInput: boolean;
}

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
  children: 'children',
};

export interface SelectInputProps extends TdSelectInputProps, StyledProps {
  options?: any[]; // 参数穿透options, 给SelectInput/SelectInput 自定义选中项呈现的内容和多选状态下设置折叠项内容
}

export default function useMultiple(props: SelectInputProps) {
  const { value } = props;
  const { classPrefix } = useConfig();
  const tagInputRef = useRef<InputRef>();
  const [tInputValue, setTInputValue] = useControlled(props, 'inputValue', props.onInputChange);
  const iKeys: SelectInputKeys = { ...DEFAULT_KEYS, ...props.keys };

  const getTags = () => {
    if (!(value instanceof Array)) {
      if (['', null, undefined].includes(value as any)) return [];
      return isObject(value) ? [value[iKeys.label]] : [value];
    }
    return value.map((item: SelectInputValue) => (isObject(item) ? item[iKeys.label] : item));
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
      autoWidth={props.autoWidth}
      readonly={props.readonly}
      minCollapsedNum={props.minCollapsedNum}
      collapsedItems={props.collapsedItems}
      tag={props.tag}
      valueDisplay={props.valueDisplay}
      placeholder={tPlaceholder}
      options={props.options}
      value={tags}
      inputValue={p.popupVisible && p.allowInput ? tInputValue : ''}
      onChange={onTagInputChange}
      onInputChange={(val, context) => {
        // 筛选器统一特性：筛选器按下回车时不清空输入框
        if (context?.trigger === 'enter' || context?.trigger === 'blur') return;
        setTInputValue(val, { trigger: context.trigger, e: context.e });
      }}
      tagProps={props.tagProps}
      onClear={p.onInnerClear}
      // [Important Info]: SelectInput.blur is not equal to TagInput, example: click popup panel
      onFocus={(val, context) => {
        props.onFocus?.(props.value, { ...context, tagInputValue: val });
      }}
      onBlur={!props.panel ? props.onBlur : null}
      {...props.tagInputProps}
      inputProps={{
        ...props.inputProps,
        readonly: !props.allowInput || props.readonly,
        inputClass: classNames(props.tagInputProps?.className, {
          [`${classPrefix}-input--focused`]: p.popupVisible,
          [`${classPrefix}-is-focused`]: p.popupVisible,
        }),
      }}
    />
  );

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    multipleInputValue: tInputValue,
    renderSelectMultiple,
  };
}
