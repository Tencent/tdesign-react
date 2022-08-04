import { MutableRefObject, useEffect } from 'react';
import useConfig from '../hooks/useConfig';

export default function useClickOutside<T extends HTMLElement>(
  refs: MutableRefObject<T>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  includePopup?: boolean,
) {
  const { classPrefix } = useConfig();
  const POPUP_SELECTOR = `.${classPrefix}-popup`;

  useEffect(() => {
    const listener = (event) => {
      if (!Array.isArray(refs)) {
        return;
      }

      let elements = [];
      if (includePopup) {
        document.querySelectorAll(POPUP_SELECTOR).forEach((ele: Element) => {
          elements.push(ele as HTMLElement);
        });
      }
      elements = Array.from(new Set(elements));

      // Do nothing if clicking ref's element or descendent elements
      if (
        refs.find((ref) => ref.current?.contains(event.target)) ||
        elements.find((el) => el?.contains(event.target))
      ) {
        return;
      }
      handler(event);
    };
    // todo: pointerdown， jsdom 暂未实现 pointer 事件，后续加上后可以改进.
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refs, handler, includePopup]);
}
