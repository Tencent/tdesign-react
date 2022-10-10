import { useEffect, useRef } from 'react';

export default function useWatch(value, fn, config = { immediate: false }) {
  const oldValue = useRef();
  const isFirst = useRef(false);
  useEffect(() => {
    if (isFirst.current) {
      fn(value, oldValue.current);
    } else {
      isFirst.current = true;

      // 是否要立即执行 fn 回调函数
      if (config.immediate) {
        fn(value, oldValue.current);
      }
    }

    oldValue.current = value;
  }, [value]);
}
