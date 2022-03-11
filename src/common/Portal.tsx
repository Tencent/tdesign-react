import React, { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode, AttachNodeReturnValue } from '../common';
import { canUseDocument } from '../_util/dom';

export interface PortalProps {
  /**
   * 指定挂载的 HTML 节点, false 为挂载在 body
   */
  attach?: React.ReactElement | AttachNode | boolean;
  children: React.ReactNode;
}

export function getAttach(attach: PortalProps['attach']) {
  if (!canUseDocument) return null;

  let parent: AttachNodeReturnValue;
  if (typeof attach === 'string') {
    parent = document.querySelector(attach);
  }
  if (typeof attach === 'function') {
    parent = attach();
  }
  if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
    parent = attach;
  }
  return parent || document.body;
}

const Portal = forwardRef((props: PortalProps, ref) => {
  const { attach, children } = props;

  const container = useMemo(() => {
    if (!canUseDocument) return null;
    const el = document.createElement('div');
    return el;
  }, []);

  useEffect(() => {
    let parentElement = document.body;
    let el = null;

    // 处理 attach
    if (typeof attach === 'function') {
      el = attach();
    } else if (typeof attach === 'string') {
      el = document.querySelector(attach);
    }

    // fix el in iframe
    if (el && el.nodeType === 1) {
      parentElement = el;
    }

    parentElement.appendChild(container);

    return () => {
      parentElement?.removeChild(container);
    };
  }, [container, attach]);

  useImperativeHandle(ref, () => container);

  return canUseDocument ? createPortal(children, container) : null;
});

Portal.displayName = 'Portal';

export default Portal;
