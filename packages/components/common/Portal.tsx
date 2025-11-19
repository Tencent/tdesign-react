import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { canUseDocument } from '../_util/dom';
import useConfig from '../hooks/useConfig';
import useIsomorphicLayoutEffect from '../hooks/useLayoutEffect';

import type { AttachNode, AttachNodeReturnValue } from '../common';

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
  style?: React.CSSProperties;
}

export function getAttach(attach: PortalProps['attach'], triggerNode?: HTMLElement): AttachNodeReturnValue {
  if (!canUseDocument) return null;

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

const Portal = forwardRef((props: PortalProps, ref) => {
  const { attach, children, triggerNode, style } = props;
  const { classPrefix } = useConfig();

  const container = useMemo(() => {
    if (!canUseDocument) return null;
    const el = document.createElement('div');
    el.className = `${classPrefix}-portal-wrapper`;
    if (typeof style === 'object') {
      Object.assign(el.style, style);
    }
    return el;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classPrefix]);

  useIsomorphicLayoutEffect(() => {
    const parentElement = getAttach(attach, triggerNode);
    parentElement?.appendChild?.(container);

    return () => {
      parentElement?.removeChild?.(container);
    };
  }, [container, attach, triggerNode]);

  useImperativeHandle(ref, () => container);

  return canUseDocument ? createPortal(children, container) : null;
});

Portal.displayName = 'Portal';

export default Portal;
