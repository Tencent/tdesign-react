import { useCallback, useState } from 'react';

// https://reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
export default function useDomRefCallback(): [HTMLElement, React.Dispatch<React.SetStateAction<HTMLElement>>] {
  const [refCurrent, setRefCurrent] = useState<HTMLElement>();

  useCallback((dom: HTMLElement) => {
    if (dom) setRefCurrent(dom);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [refCurrent, setRefCurrent];
}
