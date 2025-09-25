import React, { MouseEvent, useRef } from 'react';

import classNames from 'classnames';
import { isObject, pick } from 'lodash-es';

import useConfig from '../hooks/useConfig';
import useControlled from '../hooks/useControlled';
import Input, { type InputRef, type TdInputProps } from '../input';
import Loading from '../loading';

import type { SelectInputCommonProperties } from './interface';
import type { TdSelectInputProps } from './type';

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
  'size',
  'prefixIcon',
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
  const { value, keys, loading } = props;
  const { classPrefix } = useConfig();
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useControlled(props, 'inputValue', props.onInputChange);

  const commonInputProps: SelectInputCommonProperties = {
    ...pick(props, COMMON_PROPERTIES),
    suffixIcon: loading ? <Loading loading size="small" /> : props.suffixIcon,
  };

  const onInnerClear = (context: { e: MouseEvent<SVGSVGElement> }) => {
    context?.e?.stopPropagation();
    props.onClear?.(context);
    setInputValue('', { trigger: 'clear' });
  };

  const onInnerInputChange: TdInputProps['onChange'] = (value, context) => {
    if (props.allowInput) {
      setInputValue(value, { ...context, trigger: 'input' });
    }
  };

  const renderSelectSingle = (
    popupVisible: boolean,
    onDirectBlur?: (context: { e: React.FocusEvent<HTMLInputElement> }) => void,
  ) => {
    // 单选，值的呈现方式
    const singleValueDisplay: any = !props.multiple ? props.valueDisplay : null;
    const displayedValue = popupVisible && props.allowInput ? inputValue : getInputValue(value, keys);

    const handleBlur = (value, ctx) => {
      if (onDirectBlur) {
        onDirectBlur(ctx);
      } else {
        // 处理没有 panel 时的场景
        props.onBlur?.(value, { e: ctx.e, inputValue: value });
      }
    };

    return (
      <Input
        ref={inputRef}
        {...commonInputProps}
        autoWidth={props.autoWidth}
        allowInput={props.allowInput}
        placeholder={singleValueDisplay ? '' : props.placeholder}
        value={singleValueDisplay ? ' ' : displayedValue}
        label={
          (props.label || singleValueDisplay) && (
            <>
              {props.label}
              {singleValueDisplay as React.ReactNode}
            </>
          )
        }
        onChange={onInnerInputChange}
        onClear={onInnerClear}
        // [Important Info]: SelectInput.blur is not equal to Input, example: click popup panel
        onFocus={(val, context) => {
          props.onFocus?.(value, { ...context, inputValue: val });
          // focus might not need to change input value. it will caught some curious errors in tree-select
          // !popupVisible && setInputValue(getInputValue(value, keys), { ...context, trigger: 'input' });
        }}
        onEnter={(val, context) => {
          props.onEnter?.(value, { ...context, inputValue: val });
        }}
        // onBlur need to triggered by input when popup panel is null or when popupVisible is forced to false
        onBlur={handleBlur}
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
    singleInputValue: inputValue,
    onInnerClear,
    renderSelectSingle,
  };
}
