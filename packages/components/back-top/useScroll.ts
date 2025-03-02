import { useEffect, useState } from 'react';
import { AttachNodeReturnValue } from '../common';

type UseScrollProps = {
  target: AttachNodeReturnValue;
};

const useScroll = (props: UseScrollProps) => {
  const { target } = props;

  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!target) return;

    const setPosition = () => {
      if (target === document) {
        setScrollLeft(target.documentElement.scrollLeft);
        setScrollTop(target.documentElement.scrollTop);
      } else {
        setScrollLeft((target as HTMLElement).scrollLeft);
        setScrollTop((target as HTMLElement).scrollTop);
      }
    };
    target.addEventListener('scroll', setPosition);
    return () => {
      target.removeEventListener('scroll', setPosition);
    };
  }, [target]);

  return {
    scrollLeft,
    scrollTop,
  };
};

export default useScroll;
