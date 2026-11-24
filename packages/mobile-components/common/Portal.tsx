import React, { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode, AttachNodeReturnValue } from '../common';
import { canUseDOM } from '../_util/dom';
import useConfig from '../hooks/useConfig';
import useDefaultProps from '../hooks/useDefaultProps';

export interface PortalProps {
  /**
   * 指定挂载的 HTML 节点, false 为挂载在 body
   */
  attach?: React.ReactElement | AttachNode | boolean;
  /**
   * 触发元素
   */
  triggerNode?: HTMLElement;
  children: React.ReactNode;
}

export function getAttach(attach: PortalProps['attach'], triggerNode?: HTMLElement): AttachNodeReturnValue {
  if (!canUseDOM()) return null;

  let el: AttachNodeReturnValue;
  if (typeof attach === 'string') {
    el = document.querySelector(attach);
  }
  if (typeof attach === 'function') {
    el = attach(triggerNode);
  }
  if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
    el = attach;
  }

  // fix el in iframe
  if (el && el.nodeType === 1) return el;

  return document.body;
}

const Portal = forwardRef<HTMLElement, PortalProps>((props, ref) => {
  const { attach, children, triggerNode } = useDefaultProps<PortalProps>(props, {});

  const { classPrefix } = useConfig();

  const container = useMemo(() => {
    if (!canUseDOM()) return null;
    const el = document.createElement('div');
    el.className = `${classPrefix}-portal-wrapper`;
    return el;
  }, [classPrefix]);

  useEffect(() => {
    const parentElement = getAttach(attach, triggerNode);
    parentElement?.appendChild?.(container);

    return () => {
      parentElement?.removeChild?.(container);
    };
  }, [container, attach, triggerNode]);

  useImperativeHandle(ref, () => container);

  return canUseDOM() ? createPortal(children, container) : null;
});

Portal.displayName = 'Portal';

export default Portal;
