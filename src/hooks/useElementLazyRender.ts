import { MutableRefObject, useEffect, useRef, useState } from 'react';
import observe from '../_common/js/utils/observe';

export function useElementLazyRender(labelRef: MutableRefObject<HTMLElement>, lazyLoad: boolean) {
  const ioObserver = useRef<IntersectionObserver>();
  const [showElement, setShowElement] = useState(true);

  const handleLazyLoad = () => {
    if (!lazyLoad || !labelRef.current || ioObserver.current) return;
    setShowElement(false);
    const io = observe(
      labelRef.current,
      null,
      () => {
        setShowElement(true);
      },
      10,
    );
    ioObserver.current = io;

    return () => {
      if (!lazyLoad || !labelRef.current) return;
      // eslint-disable-next-line
      ioObserver.current?.unobserve(labelRef.current);
      ioObserver.current = null;
    };
  };

  useEffect(handleLazyLoad, [lazyLoad, labelRef]);

  return {
    showElement,
  };
}

export default useElementLazyRender;
