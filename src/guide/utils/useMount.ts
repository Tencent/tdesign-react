import { useEffect, useRef } from 'react';

export default function useMount(mount: () => void, unmount: () => void) {
  const isMounted = useRef(true);

  return useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      mount();
      return;
    }

    return unmount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
