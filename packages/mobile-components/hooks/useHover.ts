import { useEffect, useRef } from 'react';

interface HoverOptions {
  className: string;
  disabled?: string | boolean;
}

function useHover(options: HoverOptions) {
  const elRef = useRef(null);
  const { className, disabled } = options;
  const startTime = 50;
  const stayTime = 70;

  useEffect(() => {
    let currentElement: HTMLElement | null = null;

    const handleTouchStart = () => {
      if (disabled) {
        return;
      }
      setTimeout(() => {
        currentElement?.classList.add(className);
      }, startTime);
    };

    const handleTouchEnd = () => {
      if (disabled) {
        return;
      }
      setTimeout(() => {
        currentElement?.classList.remove(className);
      }, stayTime);
    };

    if (elRef.current) {
      currentElement = elRef.current;
      currentElement.addEventListener('touchstart', handleTouchStart, { capture: false, passive: true });
      currentElement.addEventListener('touchend', handleTouchEnd, false);
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener('touchstart', handleTouchStart);
        currentElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [className, disabled]);

  return elRef;
}

export default useHover;
