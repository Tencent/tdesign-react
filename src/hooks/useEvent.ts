import { useRef, useCallback } from 'react';
import useLayoutEffect from '../_util/useLayoutEffect';

// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
const useEvent = function <T extends (...args: any[]) => any>(handler: T): T {
  const handlerRef = useRef(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: any[]) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []) as T;
};

export default useEvent;
