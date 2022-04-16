import { useState } from 'react';
import noop from './noop';

export interface ChangeHandler<T, P extends any[]> {
  (value: T, ...args: P);
}

export default function useDefault<T, P extends any[]>(
  value: T,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
): [T, ChangeHandler<T, P>] {
  // 无论是否受控，都要 useState，因为 Hooks 是无条件的
  const [internalValue, setInternalValue] = useState(defaultValue);

  // 响应手动赋值 undefined, 跳过初始化阶段
  // const isMounted = useRef(false);
  // useEffect(() => {
  //   if (!isMounted.current) {
  //     isMounted.current = true;
  //     return;
  //   }

  //   setInternalValue(value);

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [value]);

  // 受控模式
  if (typeof value !== 'undefined') {
    return [value, onChange || noop];
  }

  // 非受控模式
  return [
    internalValue,
    (newValue, ...args) => {
      setInternalValue(newValue);
      if (typeof onChange === 'function') {
        onChange(newValue, ...args);
      }
    },
  ];
}
