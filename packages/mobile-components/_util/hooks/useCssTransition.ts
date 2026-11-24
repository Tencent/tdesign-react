import { RefObject, useRef } from 'react';
import { unmount } from '../react-render';

interface UseCssTransitionParams {
  contentRef: RefObject<HTMLDivElement>;
  classPrefix: string;
  container?: HTMLElement | null;
}

const useCssTransition = ({ contentRef, classPrefix, container }: UseCssTransitionParams) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const contentEle = contentRef.current;
    if (contentEle?.style.display === 'none') {
      contentEle.style.display = 'block';
    }
  };

  const handleExited = () => {
    const contentEle = contentRef.current;
    if (!contentEle) return;

    timerRef.current = setTimeout(() => {
      if (contentEle.style.display === 'block') {
        contentEle.style.display = 'none';
      }

      const remove = () => {
        if (!container) return;
        container.parentNode?.removeChild(container);
      };

      const unmountResult = unmount(container);
      if (unmountResult && typeof (unmountResult as Promise<void>).then === 'function') {
        (unmountResult as Promise<void>).then(remove);
        return;
      }

      remove();
    }, 0);
  };

  return {
    props: {
      timeout: 200,
      nodeRef: contentRef,
      onEnter: handleEnter,
      onExited: handleExited,
      classNames: {
        appear: `${classPrefix}-enter ${classPrefix}-enter-active`,
        appearActive: `${classPrefix}-enter-active`,
        appearDone: `${classPrefix}-enter-active ${classPrefix}-enter-to`,
        enter: `${classPrefix}-enter ${classPrefix}-enter-active`,
        enterActive: `${classPrefix}-enter-active`,
        enterDone: `${classPrefix}-enter-active ${classPrefix}-enter-to`,
        exit: `${classPrefix}-leave ${classPrefix}-leave-active`,
        exitActive: `${classPrefix}-leave-active`,
        exitDone: `${classPrefix}-leave-active ${classPrefix}-leave-to`,
      },
    },
  };
};

export default useCssTransition;
