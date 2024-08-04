import { Ref, useRef } from 'react';

export default function useRefAndForward<T>(initialValue: T, forwardedRef: Ref<T>) {
  const ref = useRef(initialValue);

  const forward = (instance: T) => {
    ref.current = instance;
    if (typeof forwardedRef === 'function') {
      forwardedRef(instance);
    } else if (forwardedRef) {
      (forwardedRef as any).current = instance; // eslint-disable-line no-param-reassign
    }
  };

  return [ref, forward] as [typeof ref, typeof forward];
}
