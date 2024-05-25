import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

export interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const validWindow = typeof window === 'object';

  const getSize = useCallback(
    () => ({
      width: validWindow ? window.innerWidth : undefined,
      height: validWindow ? window.innerHeight : undefined,
    }),
    [validWindow],
  );

  const [size, setSize] = useState(getSize());

  useEffect(() => {
    function handleResize() {
      setSize(getSize());
    }

    const debounceResize = debounce(handleResize, 400);
    if (validWindow) {
      window.addEventListener('resize', debounceResize);

      return () => {
        window.removeEventListener('resize', debounceResize);
        debounceResize.cancel();
      };
    }
  }, [getSize, validWindow]);

  return size;
}

export default useWindowSize;
