import { useEffect, useRef, useState } from 'react';
import observe from '@tdesign/common-js/utils/observe';

export function useElementLazyRender(labelRef: React.RefObject<HTMLElement>, lazyLoad: boolean) {
  const ioObserver = useRef<IntersectionObserver>(null);
  const [showElement, setShowElement] = useState(!lazyLoad);

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
