import { useState } from 'react';
import upperFirst from 'lodash/upperFirst';
import noop from '../_util/noop';

export interface ChangeHandler<T, P extends any[]> {
  (value: T, ...args: P);
}

type Defaultoptions<T extends string> = `default${Capitalize<T>}`;

type ToString<T extends string | number | symbol> = T extends string ? T : `${Extract<T, number>}`;

const useControlled: <P extends any[], R extends object, K extends keyof R>(
  props: R,
  valueKey: K,
  onChange: ChangeHandler<R[K], P>,
  defaultOptions?:
    | {
        [key in Defaultoptions<ToString<K>>]: R[K];
      }
    | object,
) => [R[K], ChangeHandler<R[K], P>] = (props = {} as any, valueKey, onChange, defaultOptions = {}) => {
  // 外部设置 props，说明希望受控
  const controlled = Reflect.has(props, valueKey);
  // 受控属性
  const value = props[valueKey];
  // 约定受控属性的非受控 key 为 defaultXxx，某些条件下要在运行时确定 defaultXxx 则通过 defaultOptions 来覆盖
  const defaultValue =
    defaultOptions[`default${upperFirst(valueKey as string)}`] || props[`default${upperFirst(valueKey as string)}`];

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
};

export default useControlled;
