import { useCallback, useEffect, useRef } from 'react';
import { overlayManager } from '@tdesign/common-js/utils/overlayManager';

import useLatest from './useLatest';

import type { OverlayEntry, OverlayType } from '@tdesign/common-js/utils/overlayManager';

const useOverlayManager = (
  type: OverlayType,
  {
    visible,
    getElement,
  }: {
    visible: boolean;
    getElement?: () => HTMLElement | null;
  },
) => {
  const entryRef = useRef<OverlayEntry>(null);
  const getElementRef = useLatest(getElement);

  useEffect(() => {
    if (!visible) return undefined;

    const entry = overlayManager.register({
      type,
      getElement: () => getElementRef.current?.() ?? null,
    });
    entryRef.current = entry;

    return () => {
      overlayManager.unregister(entry);
      if (entryRef.current === entry) entryRef.current = null;
    };
  }, [getElementRef, type, visible]);

  const isTopOverlay = useCallback(() => {
    return !!entryRef.current && overlayManager.isTop(entryRef.current);
  }, []);

  return { isTopOverlay };
};

export default useOverlayManager;
