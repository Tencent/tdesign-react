import { MutableRefObject, useEffect, useRef, useState } from 'react';
import observe from '../_common/js/utils/observe';

export function useElementLazyRender(labelRef: MutableRefObject<HTMLElement>, lazyLoad: boolean) {
  let ioObserver = useRef<IntersectionObserver>(null);
  const [showElement, setShowElement] = useState(true);

  const handleLazyLoad = () => {
    if (!lazyLoad || !labelRef.current) return;
    setShowElement(false)
    const io = observe(
      labelRef.current,
      null,
      () => {
        setShowElement(true)
      },
      10,
    );
    ioObserver.current = io;

    return () => {
      if (!lazyLoad || !labelRef.current) return;
      ioObserver.current?.unobserve(labelRef.current);
      ioObserver = null;
    };
  };

  useEffect(handleLazyLoad, [lazyLoad, labelRef]);

  return {
    showElement,
  };
}

export default useElementLazyRender;
