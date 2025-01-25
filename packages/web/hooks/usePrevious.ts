import { useEffect, useRef } from 'react';

// 缓存上一次的 state 用于前后比较
export default function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref.current;
}
