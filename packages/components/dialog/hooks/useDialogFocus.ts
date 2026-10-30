import { useEffect, useRef } from 'react';
import { DialogFocusController } from '@tdesign/common-js/dialog/focus';

import useLatest from '../../hooks/useLatest';

import type { MutableRefObject } from 'react';
import type { DialogFocusable } from '../type';

interface UseDialogFocusParams {
  visible: boolean;
  classPrefix: string;
  dialogRef: MutableRefObject<HTMLDivElement>;
  dialogCardRef: MutableRefObject<HTMLDivElement>;
  focusable?: DialogFocusable;
  isTop: () => boolean;
}

const useDialogFocus = ({ visible, classPrefix, dialogRef, dialogCardRef, focusable, isTop }: UseDialogFocusParams) => {
  const focusableRef = useLatest(focusable);

  const controllerRef = useRef<DialogFocusController>(null);
  if (!controllerRef.current) {
    controllerRef.current = new DialogFocusController({
      classPrefix,
      isTop,
      getDialogEl: () => dialogRef.current,
      getDialogCardEl: () => dialogCardRef.current,
      getFocusable: () => focusableRef.current,
    });
  }

  useEffect(() => {
    controllerRef.current.onVisibleChange(visible);
  }, [visible]);

  useEffect(() => {
    if (!visible || !focusable?.focusTrap) return undefined;
    return controllerRef.current.bindTrap();
  }, [focusable?.focusTrap, visible]);

  return {
    focusDialog: () => controllerRef.current.focus(),
    restoreTriggerFocus: () => controllerRef.current.restore(),
  };
};

export default useDialogFocus;
