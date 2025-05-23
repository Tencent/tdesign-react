import { debounce } from 'lodash-es';
import { useCallback, useEffect } from 'react';
import { usePersistFn } from './usePersistFn';

// https://tsdocs.dev/docs/lodash-es/4.17.21/interfaces/_internal_.DebounceSettingsLeading.html
interface DebounceSettingsLeading {
  leading: true;
  maxWait?: number;
  trailing?: boolean;
}
// https://tsdocs.dev/docs/lodash-es/4.17.21/interfaces/_internal_.DebouncedFuncLeading.html
interface DebouncedFuncLeading<T extends (...args: unknown[]) => unknown> {
  cancel(): void;
  flush(): ReturnType<T>;
  (...args): ReturnType<T>;
}
const useDebounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number,
  options?: DebounceSettingsLeading,
): DebouncedFuncLeading<T> => {
  const callback = usePersistFn(func);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useCallback(debounce(callback, delay, options), [callback, delay, options]);
  useEffect(() => debounced.cancel, [debounced]);

  return debounced;
};

export default useDebounce;
