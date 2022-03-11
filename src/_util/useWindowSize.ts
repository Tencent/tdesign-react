import { useCallback, useEffect, useState } from 'react';

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

    if (validWindow) {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [getSize, validWindow]);

  return size;
}

export default useWindowSize;
