import React, { useRef, useState, useEffect, MouseEvent, FormEvent, useMemo } from 'react';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import classNames from 'classnames';
import { SelectInputCommonProperties } from './interface';
import Input, { InputValue } from '../input';
import { TdSelectInputProps } from './type';
import { Loading } from '../loading';
import useConfig from '../_util/useConfig';

export interface RenderSelectSingleInputParams {
  tPlaceholder: string;
}

// single 和 multiple 共有特性
const COMMON_PROPERTIES = [
  'status',
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

const DEFAULT_KEYS: TdSelectInputProps['keys'] = {
  label: 'label',
  value: 'value',
};

function getInputValue(value: TdSelectInputProps['value'], keys: TdSelectInputProps['keys']) {
  const iKeys = keys || DEFAULT_KEYS;
  return isObject(value) ? value[iKeys.label] : value;
}

export default function useSingle(props: TdSelectInputProps) {
  const { value, keys, loading, disabled } = props;
  const { classPrefix } = useConfig();
  const inputRef = useRef();
  const [inputValue, setInputValue] = useState<string | number>('');

  const showLoading = useMemo(() => !disabled && loading, [loading, disabled]);

  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: showLoading ? <Loading loading size="small" /> : props.suffixIcon,
  };

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
      props.onInputChange?.(value, { ...context, trigger: 'input' });
    }
  };

  useEffect(() => {
    setInputValue(getInputValue(value, keys));
  }, [keys, value]);

  const renderSelectSingle = (popupVisible: boolean) => {
    // 单选，值的呈现方式
    const singleValueDisplay = !props.multiple ? props.valueDisplay : null;
    return (
      <Input
        ref={inputRef}
        {...commonInputProps}
        autoWidth={props.borderless || props.autoWidth}
        placeholder={singleValueDisplay ? '' : props.placeholder}
        value={singleValueDisplay ? undefined : inputValue}
        label={
          <>
            {props.label}
            {singleValueDisplay}
          </>
        }
        onChange={onInnerInputChange}
        readonly={!props.allowInput}
        onClear={onInnerClear}
        onBlur={(val, context) => {
          props.onBlur?.(value, { ...context, inputValue: val });
          setInputValue(getInputValue(value, keys));
        }}
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
        }}
        {...props.inputProps}
        className={classNames(props.inputProps?.className, {
          [`${classPrefix}-input--focused`]: popupVisible,
        })}
      />
    );
  };

  return {
    inputRef,
    commonInputProps,
    onInnerClear,
    renderSelectSingle,
  };
}
