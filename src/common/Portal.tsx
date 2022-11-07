import React, { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode, AttachNodeReturnValue } from '../common';
import { canUseDocument } from '../_util/dom';
import useConfig from '../hooks/useConfig';

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
  if (!canUseDocument) return null;

  let parent: AttachNodeReturnValue;
  if (typeof attach === 'string') {
    parent = document.querySelector(attach);
  }
  if (typeof attach === 'function') {
    parent = attach(triggerNode);
  }
  if (typeof attach === 'object' && attach instanceof window.HTMLElement) {
    parent = attach;
  }
  return parent || document.body;
}

const Portal = forwardRef((props: PortalProps, ref) => {
  const { attach, children, triggerNode } = props;
  const { classPrefix } = useConfig();

  const container = useMemo(() => {
    if (!canUseDocument) return null;
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

  return canUseDocument ? createPortal(children, container) : null;
});

Portal.displayName = 'Portal';

export default Portal;
