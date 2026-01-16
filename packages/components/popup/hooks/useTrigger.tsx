import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { canUseDocument } from '../../_util/dom';
import { off, on } from '../../_util/listener';
import { composeRefs, getNodeRef, getRefDom, supportNodeRef } from '../../_util/ref';
import useConfig from '../../hooks/useConfig';
import useResizeObserver from '../../hooks/useResizeObserver';

const ESC_KEY = 'Escape';

const isEventFromDisabledElement = (e: Event | React.SyntheticEvent, container: Element) => {
  const target = e.target as Element;
  const disabledEl = target?.closest?.('[disabled]');
  return !!(disabledEl && container.contains(disabledEl));
};

export default function useTrigger({ triggerElement, content, disabled, trigger, visible, onVisibleChange, delay }) {
  const { classPrefix } = useConfig();

  const triggerElementIsString = typeof triggerElement === 'string';

  const triggerRef = useRef<HTMLElement>(null);
  const hasPopupMouseDown = useRef(false);
  const visibleTimer = useRef(null);

  // 禁用和无内容时不展示
  const shouldToggle = useMemo(() => {
    if (disabled) return false;
    return content === 0 ? true : !!content;
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
    if (!canUseDocument) return null;
    if (triggerElementIsString) return document.querySelector(triggerElement);
    const element = getRefDom(triggerRef);
    return element instanceof Element ? element : null;
  }, [triggerElementIsString, triggerElement]);

  const handleMouseLeave = (e: MouseEvent | React.MouseEvent) => {
    if (trigger !== 'hover' || hasPopupMouseDown.current) return;
    const relatedTarget = e.relatedTarget as HTMLElement;
    const isMovingToContent = relatedTarget?.closest?.(`.${classPrefix}-popup`);
    if (isMovingToContent) return;
    callFuncWithDelay({
      delay: exitDelay,
      callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-hover' }),
    });
  };

  const handlePopupMouseDown = () => {
    hasPopupMouseDown.current = true;
  };

  const handlePopupMouseUp = () => {
    requestAnimationFrame(() => {
      hasPopupMouseDown.current = false;
    });
  };

  useEffect(() => clearTimeout(visibleTimer.current), []);

  useEffect(() => {
    if (!shouldToggle) return;

    const element = getTriggerElement();
    if (!element) return;

    const handleClick = (e: MouseEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'click') {
        callFuncWithDelay({
          delay: visible ? appearDelay : exitDelay,
          callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-click' }),
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'mousedown') {
        callFuncWithDelay({
          delay: visible ? appearDelay : exitDelay,
          callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-mousedown' }),
        });
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      if (trigger === 'hover') {
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
        });
      }
    };

    const handleFocus = (e: FocusEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'focus') {
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-focus' }),
        });
      }
    };

    const handleBlur = (e: FocusEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'focus') {
        callFuncWithDelay({
          delay: exitDelay,
          callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-blur' }),
        });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'context-menu') {
        e.preventDefault();
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'context-menu' }),
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
      if (trigger === 'hover' || trigger === 'mousedown') {
        callFuncWithDelay({
          delay: appearDelay,
          callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEventFromDisabledElement(e, element)) return;
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
      if (!visible || getTriggerElement()?.contains?.(e.target) || hasPopupMouseDown.current) return;
      onVisibleChange(false, { e, trigger: 'document' });
    };

    on(document, 'mousedown', handleDocumentClick);
    on(document, 'touchend', handleDocumentClick, { passive: true });

    return () => {
      // 嵌套使用，父 Popup 关闭时，子 Popup 也要关闭
      // 针对父 Popup 关闭时，trigger 元素直接从 DOM 移除的场景
      // 避免监听器提早被销毁无法触发
      requestAnimationFrame(() => {
        off(document, 'mousedown', handleDocumentClick);
        off(document, 'touchend', handleDocumentClick, { passive: true });
      });
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

  useResizeObserver(
    triggerRef,
    (entries) => {
      entries.forEach((entry) => {
        // 嵌套使用
        // 针对父 Popup 关闭时，trigger 隐藏的场景
        if (entry.contentRect.width === 0 && entry.contentRect.height === 0) {
          const element = entry.target as HTMLElement;
          // 检查元素是否真的被隐藏（完全通过判断尺寸为 0x0，会误判 inline 元素）
          const computedStyle = window.getComputedStyle(element);
          const isHidden =
            computedStyle.display === 'none' || computedStyle.visibility === 'hidden' || computedStyle.opacity === '0';
          if (isHidden) {
            onVisibleChange(false, { trigger: 'document' });
          }
        }
      });
    },
    visible && shouldToggle,
  );

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

  function getPopupProps() {
    return {
      onMouseLeave: handleMouseLeave,
      onMouseDown: handlePopupMouseDown,
      onMouseUp: handlePopupMouseUp,
      onTouchStart: handlePopupMouseDown,
      onTouchEnd: handlePopupMouseUp,
    };
  }

  return {
    triggerElementIsString,
    getTriggerElement,
    getTriggerNode,
    getPopupProps,
  };
}
