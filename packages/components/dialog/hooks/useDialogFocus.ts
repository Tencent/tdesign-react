import { useCallback, useEffect, useRef } from 'react';

import { isTopDialog } from './useDialogEsc';

import type { MutableRefObject } from 'react';
import type { DialogFocusable } from '../type';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => {
    if (element.tabIndex < 0 || element.closest('[hidden], [aria-hidden="true"]')) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
};

interface UseDialogFocusParams {
  visible: boolean;
  componentCls: string;
  dialogRef: MutableRefObject<HTMLDivElement>;
  dialogCardRef: MutableRefObject<HTMLDivElement>;
  focusable?: DialogFocusable;
}

const useDialogFocus = ({ visible, componentCls, dialogRef, dialogCardRef, focusable }: UseDialogFocusParams) => {
  const focusableRef = useRef(focusable);
  const triggerRef = useRef<HTMLElement>(null);
  const wasVisibleRef = useRef(false);
  const lastFocusedRef = useRef<HTMLElement>(null);

  focusableRef.current = focusable;

  useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
    wasVisibleRef.current = visible;
  }, [visible]);

  const getDefaultFocusElement = useCallback(() => {
    const defaultFocus = focusableRef.current?.defaultFocus;
    if (typeof defaultFocus === 'function') return defaultFocus();
    if (defaultFocus === 'confirm-button') {
      return dialogCardRef.current?.querySelector<HTMLElement>(`.${componentCls}__confirm`) ?? null;
    }
    if (defaultFocus === 'cancel-button') {
      return dialogCardRef.current?.querySelector<HTMLElement>(`.${componentCls}__cancel`) ?? null;
    }
    return defaultFocus === undefined ? dialogRef.current : null;
  }, [componentCls, dialogCardRef, dialogRef]);

  const focusDialog = useCallback(() => {
    getDefaultFocusElement()?.focus();
  }, [getDefaultFocusElement]);

  const restoreTriggerFocus = useCallback(() => {
    if (!focusableRef.current?.focusTriggerAfterClose) return;
    const trigger = triggerRef.current;
    if (trigger?.isConnected) trigger.focus();
    triggerRef.current = null;
  }, []);

  useEffect(() => {
    if (!visible || !focusable?.focusTrap) return;

    const focusFallback = (preferLast = false) => {
      const dialogCard = dialogCardRef.current;
      const focusableElements = dialogCard ? getFocusableElements(dialogCard) : [];
      const target = preferLast ? focusableElements[focusableElements.length - 1] : focusableElements[0];
      (target ?? dialogRef.current)?.focus();
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (!isTopDialog(dialogRef)) return;
      const target = event.target as HTMLElement;
      if (dialogRef.current?.contains(target)) {
        lastFocusedRef.current = target;
        return;
      }
      if (lastFocusedRef.current && dialogRef.current?.contains(lastFocusedRef.current)) {
        lastFocusedRef.current.focus();
      } else {
        focusFallback();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !isTopDialog(dialogRef)) return;
      const dialogCard = dialogCardRef.current;
      const focusableElements = dialogCard ? getFocusableElements(dialogCard) : [];
      if (!focusableElements.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const { activeElement } = document;
      const isOutsideFocusableElements = !focusableElements.includes(activeElement as HTMLElement);
      if (
        (event.shiftKey && (activeElement === first || isOutsideFocusableElements)) ||
        (!event.shiftKey && activeElement === last)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedRef.current = null;
    };
  }, [dialogCardRef, dialogRef, focusable?.focusTrap, visible]);

  return { focusDialog, restoreTriggerFocus };
};

export default useDialogFocus;
