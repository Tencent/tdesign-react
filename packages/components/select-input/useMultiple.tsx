import React, { useRef } from 'react';

import classNames from 'classnames';
import { isObject } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import TagInput, { type TagInputValue } from '../tag-input';

import type { StyledProps } from '../common';
import type { InputRef } from '../input';
import type { SelectInputCommonProperties } from './interface';
import type { SelectInputChangeContext, SelectInputKeys, SelectInputValue, TdSelectInputProps } from './type';

export interface RenderSelectMultipleParams {
  commonInputProps: SelectInputCommonProperties;
  popupVisible: boolean;
  allowInput: boolean;
  onInnerClear: (context: { e: React.MouseEvent<SVGElement> }) => void;
  onInnerBlur?: (context: { e: React.FocusEvent<HTMLInputElement> }) => void;
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
  const readOnly = props.readOnly || props.readonly;

  const { classPrefix } = useConfig();

  const [tInputValue, setTInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const tagInputRef = useRef<InputRef>(null);

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

  const renderSelectMultiple = (p: RenderSelectMultipleParams) => {
    const handleBlur = (value: SelectInputValue, context: { e: React.FocusEvent<HTMLInputElement> }) => {
      if (!p.popupVisible) {
        p.onInnerBlur(context);
      } else if (!props.panel) {
        props.onBlur?.(value, { e: context.e, inputValue: tInputValue, tagInputValue: tags });
      }
    };

    const handleFocus = (
      val: TagInputValue,
      context: { e: React.FocusEvent<HTMLInputElement>; inputValue: string },
    ) => {
      props.onFocus?.(props.value, { ...context, tagInputValue: val });
    };

    return (
      <TagInput
        ref={tagInputRef}
        {...p.commonInputProps}
        autoWidth={props.autoWidth}
        readOnly={readOnly}
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
        onClear={p.onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to TagInput, example: click popup panel
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props.tagInputProps}
        tagProps={{ ...props.tagProps, ...props.tagInputProps?.tagProps }}
        inputProps={{
          ...props.inputProps,
          readOnly: !props.allowInput || readOnly,
          readonly: !props.allowInput || readOnly,
          inputClass: classNames(props.tagInputProps?.className, {
            [`${classPrefix}-input--focused`]: p.popupVisible,
            [`${classPrefix}-is-focused`]: p.popupVisible,
          }),
        }}
      />
    );
  };

  return {
    tags,
    tPlaceholder,
    tagInputRef,
    multipleInputValue: tInputValue,
    renderSelectMultiple,
  };
}
