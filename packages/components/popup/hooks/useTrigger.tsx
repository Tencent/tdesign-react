import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { off, on } from '../../_util/listener';
import { composeRefs, getNodeRef, getRefDom, supportNodeRef } from '../../_util/ref';
import useConfig from '../../hooks/useConfig';

const ESC_KEY = 'Escape';

export default function useTrigger({ triggerElement, content, disabled, trigger, visible, onVisibleChange, delay }) {
  const { classPrefix } = useConfig();

  const triggerElementIsString = typeof triggerElement === 'string';

  const triggerRef = useRef<HTMLElement>(null);
  const visibleTimer = useRef(null);
  const leaveFlag = useRef(false); // 防止多次触发显隐

  // 禁用和无内容时不展示
  const shouldToggle = useMemo(() => {
    if (disabled) return false;
    return !!content;
  }, [disabled, content]);

  // 解析 delay 数据类型
  const [appearDelay = 0, exitDelay = 0] = useMemo(() => {
    if (Array.isArray(delay)) return delay;
    return [delay, delay];
  }, [delay]);

  function callFuncWithDelay({ delay, callback }: { delay?: number; callback: Function }) {
    clearTimeout(visibleTimer.current);
    if (delay) {
      visibleTimer.current = setTimeout(callback, delay);
    } else {
      callback();
    }
  }

  const getTriggerElement = useCallback(() => {
    let element = null;
    if (triggerElementIsString) {
      element = document.querySelector(triggerElement);
    } else {
      element = getRefDom(triggerRef);
    }
    return element instanceof HTMLElement ? element : null;
  }, [triggerElementIsString, triggerElement]);

  useEffect(() => clearTimeout(visibleTimer.current), []);

  useEffect(() => {
    if (!shouldToggle) return;

    const element = getTriggerElement();
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      if (trigger === 'click') {
        callFuncWithDelay({
          delay: visible ? appearDelay : exitDelay,
          callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-click' }),
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (trigger === 'mousedown') {
        callFuncWithDelay({
          delay: visible ? appearDelay : exitDelay,
          callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-mousedown' }),
        });
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (trigger === 'hover') {
        leaveFlag.current = false;
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
        });
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (trigger === 'hover') {
        leaveFlag.current = false;
        callFuncWithDelay({
          delay: exitDelay,
          callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-hover' }),
        });
      }
    };

    const handleFocus = (e: FocusEvent) => {
      if (trigger === 'focus') {
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-focus' }),
        });
      }
    };

    const handleBlur = (e: FocusEvent) => {
      if (trigger === 'focus') {
        callFuncWithDelay({
          delay: exitDelay,
          callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-blur' }),
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (trigger === 'context-menu') {
        e.preventDefault();
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'context-menu' }),
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (trigger === 'hover' || trigger === 'mousedown') {
        leaveFlag.current = false;
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e?.key === ESC_KEY) {
        callFuncWithDelay({
          delay: exitDelay,
          callback: () => onVisibleChange(false, { e, trigger: 'keydown-esc' }),
        });
      }
    };

    on(element, 'click', handleClick);
    on(element, 'mousedown', handleMouseDown);
    on(element, 'mouseenter', handleMouseEnter);
    on(element, 'mouseleave', handleMouseLeave);
    on(element, 'focus', handleFocus);
    on(element, 'blur', handleBlur);
    on(element, 'contextmenu', handleContextMenu);
    on(element, 'touchstart', handleTouchStart, { passive: true });
    on(element, 'keydown', handleKeyDown);
    return () => {
      off(element, 'click', handleClick);
      off(element, 'mousedown', handleMouseDown);
      off(element, 'mouseenter', handleMouseEnter);
      off(element, 'mouseleave', handleMouseLeave);
      off(element, 'focus', handleFocus);
      off(element, 'blur', handleBlur);
      off(element, 'contextmenu', handleContextMenu);
      off(element, 'touchstart', handleTouchStart, { passive: true });
      off(element, 'keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classPrefix, shouldToggle, appearDelay, exitDelay, trigger, visible, onVisibleChange]);

  useEffect(() => {
    if (!shouldToggle) return;

    const handleDocumentClick = (e: any) => {
      const element = getTriggerElement();
      if (element?.contains?.(e.target) || e.target?.closest?.(`.${classPrefix}-popup`)) return;
      visible && onVisibleChange(false, { e, trigger: 'document' });
    };

    on(document, 'mousedown', handleDocumentClick);
    on(document, 'touchend', handleDocumentClick, { passive: true });
    return () => {
      off(document, 'mousedown', handleDocumentClick);
      off(document, 'touchend', handleDocumentClick, { passive: true });
    };
  }, [classPrefix, shouldToggle, visible, onVisibleChange, getTriggerElement]);

  useEffect(() => {
    const element = getTriggerElement();
    if (visible) {
      element?.classList.add(`${classPrefix}-popup-open`);
    } else {
      element?.classList.remove(`${classPrefix}-popup-open`);
    }
    return () => {
      element?.classList.remove(`${classPrefix}-popup-open`);
    };
  }, [visible, classPrefix, getTriggerElement]);

  function getTriggerNode(children: React.ReactNode) {
    if (triggerElementIsString) return;

    if (supportNodeRef(children)) {
      const childRef = getNodeRef(children);
      const ref = composeRefs(triggerRef, childRef);
      return React.cloneElement(children, { ref });
    }

    return (
      <span ref={triggerRef} className={`${classPrefix}-trigger`}>
        {children}
      </span>
    );
  }

  return {
    triggerElementIsString,
    getTriggerElement,
    getTriggerNode,
  };
}
