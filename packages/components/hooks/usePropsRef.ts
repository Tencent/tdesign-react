import { useEffect, useRef } from 'react';

export const usePropRef = <T = unknown>(prop: T) => {
  const ref = useRef<T>(prop);

  useEffect(() => {
    ref.current = prop;
  }, [prop]);

  return ref;
};
