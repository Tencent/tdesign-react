import { useState } from 'react';
import upperFirst from 'lodash/upperFirst';
import noop from '../_util/noop';

export interface ChangeHandler<T, P extends any[]> {
  (value: T, ...args: P);
}

export default function useControlled<T, P extends any[]>(
  props: object = {},
  valueKey: string,
  onChange: ChangeHandler<T, P>,
  defaultOptions: object = {},
): [T, ChangeHandler<T, P>] {
  // 外部设置 props，说明希望受控
  const controlled = Reflect.has(props, valueKey);
  // 受控属性
  const value = props[valueKey];
  // 约定受控属性的非受控 key 为 defaultXxx，某些条件下要在运行时确定 defaultXxx 则通过 defaultOptions 来覆盖
  const defaultValue = defaultOptions[`default${upperFirst(valueKey)}`] || props[`default${upperFirst(valueKey)}`];

  // 无论是否受控，都要维护一个内部变量，默认值由 defaultValue 控制
  const [internalValue, setInternalValue] = useState(defaultValue);

  // 受控模式
  if (controlled) return [value, onChange || noop];

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      setInternalValue(newValue);
      onChange?.(newValue, ...args);
    },
  ];
}
