import { useEffect, useState } from 'react';
import { debounce } from 'lodash-es';
import { getWindowSize } from '../_util/dom';

export interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [size, setSize] = useState(getWindowSize);

  useEffect(() => {
    function handleResize() {
      setSize(getWindowSize());
    }

    const debounceResize = debounce(handleResize, 400);

    window.addEventListener('resize', debounceResize);

    return () => {
      window.removeEventListener('resize', debounceResize);
      debounceResize.cancel();
    };
  }, []);

  return size;
}

export default useWindowSize;
