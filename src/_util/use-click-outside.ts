import { MutableRefObject, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  ref: MutableRefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  // 用 ref 存起来，防止无限刷新
  const handlerRef = useRef(handler);
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // 如果点击了目标 dom 树的任意一个节点，不算做 outside
      if (!ref.current || ref.current.contains(event.target as any)) {
        return;
      }

      handlerRef.current(event);
    };

    document.addEventListener('click', listener);

    return () => {
      document.removeEventListener('click', listener);
    };
  }, [ref, handlerRef]);
}
