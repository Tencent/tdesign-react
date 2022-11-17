import React, { useRef, useEffect, isValidElement, useCallback } from 'react';
import { isFragment } from 'react-is';
import classNames from 'classnames';
import { supportRef, getRefDom } from '../utils/ref';
import composeRefs from '../../_util/composeRefs';

const ESC_KEY = 'Escape';

export default function useTrigger({ content, disabled, trigger, visible, onVisibleChange, triggerRef }) {
  const hasPopupMouseDown = useRef(false);
  const mouseDownTimer = useRef(0);
  const triggerDataKey = useRef(`t-popup--${Math.random().toFixed(10)}`);

  // 禁用和无内容时不展示
  const shouldToggle = !disabled && content;

  // 点击 trigger overlay 以外的元素关闭
  useEffect(() => {
    if (!shouldToggle) return;

    const handleDocumentClick = (e: any) => {
      if (getRefDom(triggerRef)?.contains?.(e.target) || hasPopupMouseDown.current) {
        return;
      }
      visible && onVisibleChange(false, { e, trigger: 'document' });
    };
    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchend', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchend', handleDocumentClick);
    };
  }, [shouldToggle, visible, onVisibleChange, triggerRef]);

  // 弹出内容交互处理
  function getPopupProps(): any {
    if (!shouldToggle) return {};

    return {
      onMouseEnter: (e: MouseEvent) => {
        if (trigger === 'hover') {
          onVisibleChange(true, { e, trigger: 'trigger-element-hover' });
        }
      },
      onMouseLeave: (e: MouseEvent) => {
        if (trigger === 'hover') {
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
  function getTriggerProps(triggerNode: React.ReactElement) {
    if (!shouldToggle) return {};

    const triggerProps: any = {
      className: visible ? classNames(triggerNode.props.className, `t-popup-open`) : triggerNode.props.className,
      onClick: (e: MouseEvent) => {
        if (trigger === 'click') {
          onVisibleChange(!visible, { e, trigger: 'trigger-element-click' });
        }
        triggerNode.props.onClick?.(e);
      },
      onTouchStart: (e: TouchEvent) => {
        if (trigger === 'hover') {
          onVisibleChange(true, { e, trigger: 'trigger-element-hover' });
        }
        triggerNode.props.onTouchStart?.(e);
      },
      onMouseEnter: (e: MouseEvent) => {
        if (trigger === 'hover') {
          onVisibleChange(true, { e, trigger: 'trigger-element-hover' });
        }
        triggerNode.props.onMouseEnter?.(e);
      },
      onMouseLeave: (e: MouseEvent) => {
        if (trigger === 'hover') {
          onVisibleChange(false, { e, trigger: 'trigger-element-hover' });
        }
        triggerNode.props.onMouseLeave?.(e);
      },
      onFocus: (...args: any) => {
        if (trigger === 'focus') {
          onVisibleChange(true, { trigger: 'trigger-element-focus' });
        }
        triggerNode.props.onFocus?.(...args);
      },
      onBlur: (...args: any) => {
        if (trigger === 'focus') {
          onVisibleChange(false, { trigger: 'trigger-element-blur' });
        }
        triggerNode.props.onBlur?.(...args);
      },
      onContextMenu: (e: MouseEvent) => {
        if (trigger === 'context-menu') {
          onVisibleChange(true, { e, trigger: 'context-menu' });
        }
        triggerNode.props.onContextMenu?.(e);
      },
      onKeyDown: (e: KeyboardEvent) => {
        if (e?.key === ESC_KEY) {
          onVisibleChange(false, { e, trigger: 'keydown-esc' });
        }
        triggerNode.props.onKeyDown?.(e);
      },
    };

    if (supportRef(triggerNode)) {
      triggerProps.ref = composeRefs(triggerRef, (triggerNode as any).ref);
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
  const getTriggerDom = useCallback(() => document.querySelector(`[data-popup="${triggerDataKey.current}"]`), []);

  return {
    getTriggerNode,
    getPopupProps,
    getTriggerDom,
  };
}
