import React, { useRef, useEffect, isValidElement, useCallback, useMemo } from 'react';
import { isFragment } from 'react-is';
import classNames from 'classnames';
import { supportRef, getRefDom, getNodeRef } from '../../_util/ref';
import composeRefs from '../../_util/composeRefs';
import { off, on } from '../../_util/listener';

const ESC_KEY = 'Escape';

export default function useTrigger({ content, disabled, trigger, visible, onVisibleChange, triggerRef, delay }) {
  const hasPopupMouseDown = useRef(false);
  const mouseDownTimer = useRef(0);
  const visibleTimer = useRef(null);
  const triggerDataKey = useRef(`t-popup--${Math.random().toFixed(10)}`);
  const leaveFlag = useRef(false); // 防止多次触发显隐

  // 禁用和无内容时不展示
  const shouldToggle = useMemo(() => {
    if (disabled) return false; // 禁用
    return !disabled && content === 0 ? true : content; // 无内容时
  }, [disabled, content]);

  // 解析 delay 数据类型
  const [appearDelay = 0, exitDelay = 0] = useMemo(() => {
    if (Array.isArray(delay)) return delay;
    return [delay, delay];
  }, [delay]);

  function callFuncWithDelay({ delay, callback }: { delay?: number; callback: Function }) {
    if (delay) {
      clearTimeout(visibleTimer.current);
      visibleTimer.current = setTimeout(callback, delay);
    } else {
      callback();
    }
  }

  // 点击 trigger overlay 以外的元素关闭
  useEffect(() => {
    if (!shouldToggle) return;

    const handleDocumentClick = (e: any) => {
      if (getRefDom(triggerRef)?.contains?.(e.target) || hasPopupMouseDown.current) {
        return;
      }
      visible && onVisibleChange(false, { e, trigger: 'document' });
    };
    on(document, 'mousedown', handleDocumentClick);
    on(document, 'touchend', handleDocumentClick);
    return () => {
      off(document, 'mousedown', handleDocumentClick);
      off(document, 'touchend', handleDocumentClick);
    };
  }, [shouldToggle, visible, onVisibleChange, triggerRef]);

  // 弹出内容交互处理
  function getPopupProps(): any {
    if (!shouldToggle) return {};

    return {
      onMouseEnter: (e: MouseEvent) => {
        if (trigger === 'hover' && !leaveFlag.current) {
          clearTimeout(visibleTimer.current);
          onVisibleChange(true, { e, trigger: 'trigger-element-hover' });
        }
      },
      onMouseLeave: (e: MouseEvent) => {
        if (trigger === 'hover') {
          leaveFlag.current = true;
          clearTimeout(visibleTimer.current);
          onVisibleChange(false, { e, trigger: 'trigger-element-hover' });
        }
      },
      onMouseDown: () => {
        clearTimeout(mouseDownTimer.current);
        hasPopupMouseDown.current = true;
        mouseDownTimer.current = window.setTimeout(() => {
          hasPopupMouseDown.current = false;
        });
      },
      onTouchEnd: () => {
        clearTimeout(mouseDownTimer.current);
        hasPopupMouseDown.current = true;
        mouseDownTimer.current = window.setTimeout(() => {
          hasPopupMouseDown.current = false;
        });
      },
    };
  }

  // 整理 trigger props
  function getTriggerProps(triggerNode: React.ReactElement<any>) {
    if (!shouldToggle) return {};

    const triggerProps: any = {
      className: visible ? classNames(triggerNode.props.className, `t-popup-open`) : triggerNode.props.className,
      onMouseDown: (e: MouseEvent) => {
        if (trigger === 'mousedown') {
          callFuncWithDelay({
            delay: visible ? appearDelay : exitDelay,
            callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-mousedown' }),
          });
        }
        triggerNode.props.onMouseDown?.(e);
      },
      onClick: (e: MouseEvent) => {
        if (trigger === 'click') {
          callFuncWithDelay({
            delay: visible ? appearDelay : exitDelay,
            callback: () => onVisibleChange(!visible, { e, trigger: 'trigger-element-click' }),
          });
        }
        triggerNode.props.onClick?.(e);
      },
      onTouchStart: (e: TouchEvent) => {
        if (trigger === 'hover' || trigger === 'mousedown') {
          leaveFlag.current = false;
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
          });
        }
        triggerNode.props.onTouchStart?.(e);
      },
      onMouseEnter: (e: MouseEvent) => {
        if (trigger === 'hover') {
          leaveFlag.current = false;
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(true, { e, trigger: 'trigger-element-hover' }),
          });
        }
        triggerNode.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e: MouseEvent) => {
        if (trigger === 'hover') {
          leaveFlag.current = false;
          callFuncWithDelay({
            delay: exitDelay,
            callback: () => onVisibleChange(false, { e, trigger: 'trigger-element-hover' }),
          });
        }
        triggerNode.props.onMouseLeave?.(e);
      },
      onFocus: (...args: any) => {
        if (trigger === 'focus') {
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(true, { trigger: 'trigger-element-focus' }),
          });
        }
        triggerNode.props.onFocus?.(...args);
      },
      onBlur: (...args: any) => {
        if (trigger === 'focus') {
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(false, { trigger: 'trigger-element-blur' }),
          });
        }
        triggerNode.props.onBlur?.(...args);
      },
      onContextMenu: (e: MouseEvent) => {
        if (trigger === 'context-menu') {
          e.preventDefault();
          callFuncWithDelay({
            delay: appearDelay,
            callback: () => onVisibleChange(true, { e, trigger: 'context-menu' }),
          });
        }
        triggerNode.props.onContextMenu?.(e);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e?.key === ESC_KEY) {
          callFuncWithDelay({
            delay: exitDelay,
            callback: () => onVisibleChange(false, { e, trigger: 'keydown-esc' }),
          });
        }
        triggerNode.props.onKeyDown?.(e);
      },
    };

    if (supportRef(triggerNode)) {
      triggerProps.ref = composeRefs(triggerRef, getNodeRef(triggerNode as any));
    } else {
      // 标记 trigger 元素
      triggerProps['data-popup'] = triggerDataKey.current;
    }

    return triggerProps;
  }

  // 整理 trigger 元素
  function getTriggerNode(children: React.ReactNode) {
    const triggerNode =
      isValidElement(children) && !isFragment(children) ? children : <span className="t-trigger">{children}</span>;

    return React.cloneElement(triggerNode, getTriggerProps(triggerNode));
  }

  // ref 透传失败时使用 dom 查找
  const getTriggerDom = useCallback(() => {
    if (typeof document === 'undefined') return {};
    return document.querySelector(`[data-popup="${triggerDataKey.current}"]`);
  }, []);

  return {
    getTriggerNode,
    getPopupProps,
    getTriggerDom,
  };
}
