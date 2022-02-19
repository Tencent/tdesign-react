import React, { useRef, useState, ReactNode, useEffect, MouseEvent, FormEvent } from 'react';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import { SelectInputCommonProperties } from './interface';
import Input, { InputValue } from '../input';
import { TdSelectInputProps } from './type';

export interface RenderSelectSingleInputParams {
  prefixContent: ReactNode[];
  singleValueDisplay: ReactNode;
  tPlaceholder: string;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
  'tips',
  'clearable',
  'disabled',
  'label',
  'placeholder',
  'readonly',
  'suffix',
  'suffixIcon',
  'onPaste',
  'onEnter',
  'onMouseenter',
  'onMouseleave',
];

const DEFAULT_KEYS = {
  label: 'label',
  key: 'key',
};

export default function useSingle(props: TdSelectInputProps) {
  const { value } = props;
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState<string | number>('');

  const commonInputProps: SelectInputCommonProperties = pick(props, COMMON_PROPERTIES);

  const onInnerClear = (context: { e: MouseEvent<SVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('');
  };

  const onInnerInputChange = (
    value: InputValue,
    context: { e: FormEvent<HTMLDivElement> | MouseEvent<HTMLElement | SVGElement> },
  ) => {
    if (props.allowInput) {
      setInputValue(value);
      props.onInputChange?.(value, context);
    }
  };

  useEffect(() => {
    const iKeys = { ...DEFAULT_KEYS, ...props.keys };
    const val = isObject(value) ? value[iKeys.label] : value;
    setInputValue(val);
  }, [props.keys, value]);

  const renderSelectSingle = (p: RenderSelectSingleInputParams) => (
    <Input
      ref={inputRef}
      {...commonInputProps}
      autoWidth={props.borderless}
      placeholder={p.singleValueDisplay ? '' : props.placeholder}
      value={p.singleValueDisplay ? undefined : inputValue}
      label={p.prefixContent.length ? p.prefixContent : undefined}
      onChange={onInnerInputChange}
      readonly={!props.allowInput}
      onClear={onInnerClear}
      onBlur={(val, context) => {
        props.onBlur?.(value, { ...context, inputValue: val });
      }}
      onFocus={(val, context) => {
        props.onFocus?.(value, { ...context, inputValue: val });
      }}
      {...props.inputProps}
    />
  );

  return {
    inputRef,
    commonInputProps,
    onInnerClear,
    renderSelectSingle,
  };
}
