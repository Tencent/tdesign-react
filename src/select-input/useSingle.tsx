import React, { useRef, MouseEvent, FormEvent, useMemo } from 'react';
import isObject from 'lodash/isObject';
import pick from 'lodash/pick';
import classNames from 'classnames';
import { SelectInputCommonProperties } from './interface';
import Input, { InputValue } from '../input';
import { TdSelectInputProps } from './type';
import { Loading } from '../loading';
import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';

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
  const [inputValue, setInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const showLoading = useMemo(() => !disabled && loading, [loading, disabled]);

  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: showLoading ? <Loading loading size="small" /> : props.suffixIcon,
  };

  const onInnerClear = (context: { e: MouseEvent<SVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange = (
    value: InputValue,
    context: { e: FormEvent<HTMLInputElement> | MouseEvent<HTMLElement | SVGElement> },
  ) => {
    if (props.allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  const renderSelectSingle = (popupVisible: boolean) => {
    // 单选，值的呈现方式
    const singleValueDisplay = !props.multiple ? props.valueDisplay : null;
    const displayedValue = popupVisible && props.allowInput ? inputValue : getInputValue(value, keys);
    return (
      <Input
        ref={inputRef}
        {...commonInputProps}
        autoWidth={props.autoWidth}
        placeholder={singleValueDisplay ? '' : props.placeholder}
        value={singleValueDisplay ? ' ' : displayedValue}
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
        }}
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
          !popupVisible && setInputValue(getInputValue(value, keys), { ...context, trigger: 'input' });
        }}
        onEnter={(val, context) => {
          props.onEnter?.(value, { ...context, inputValue: val });
        }}
        {...props.inputProps}
        inputClass={classNames(props.inputProps?.className, {
          [`${classPrefix}-input--focused`]: popupVisible,
          [`${classPrefix}-is-focused`]: popupVisible,
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
