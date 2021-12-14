import React, { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode, AttachNodeReturnValue } from '../common';

export interface PortalProps {
  /**
   * 指定挂载的 HTML 节点, false 为挂载在 body
   */
  getContainer?: React.ReactElement | AttachNode | boolean;
  children: React.ReactNode;
}

export function getAttach(attach: PortalProps['getContainer']) {
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
  const { getContainer, children } = props;
  const [parentContainer, container] = useMemo(() => {
    const parent = getAttach(getContainer);

    if (parent) {
      const div = document.createElement('div');
      parent.appendChild(div);
      return [parent, div];
    }
  }, [getContainer]);

  useEffect(
    () => () => {
      container.remove();
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useImperativeHandle(ref, () => parentContainer);

  return createPortal(children, container);
});

Portal.displayName = 'Portal';

export default Portal;
