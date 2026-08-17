import { useCallback, useState } from 'react';

import type { RefCallback } from 'react';

// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
export default function useDomRefCallback(): [HTMLElement, RefCallback<HTMLElement>] {
  const [refCurrent, setRefCurrent] = useState<HTMLElement>();

  const setRef = useCallback<RefCallback<HTMLElement>>((dom) => {
    if (!dom) return;
    setRefCurrent((prev) => (prev === dom ? prev : dom));
  }, []);

  return [refCurrent, setRef];
}
