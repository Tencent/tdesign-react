import { debounce, DebounceSettingsLeading } from 'lodash';
import { useCallback, useEffect } from 'react';
import useEvent from './useEvent';

const useDebounce = <T extends (...args: any) => any>(func: T, delay: number, options?: DebounceSettingsLeading) => {
  const callback = useEvent(func);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useCallback(debounce(callback, delay, options), [callback, delay, options]);
  useEffect(() => debounced.cancel, [debounced]);

  return debounced;
};

export default useDebounce;
