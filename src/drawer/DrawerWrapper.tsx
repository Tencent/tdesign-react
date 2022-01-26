import React, { useRef, forwardRef, useImperativeHandle, cloneElement } from 'react';
import Portal, { PortalProps, getAttach } from '../common/Portal';
import { DrawerProps } from './Drawer';

export interface DrawerWrapperProps extends PortalProps {
  attach?: DrawerProps['attach'];
  children: React.ReactElement;
}

const DrawerWrapper = forwardRef((props: DrawerWrapperProps, ref) => {
  const { children, attach } = props;
  const portalRef = useRef<HTMLDivElement>(null);
  let portal = null;

  useImperativeHandle(ref, () => {
    if (attach === '') {
      return portalRef.current.parentElement;
    }

    return getAttach(attach);
  });

  // 如果 attach === '',渲染在当前组件节点中。
  if (attach === '') {
    portal = <div ref={portalRef}>{cloneElement(children)}</div>;
  } else {
    portal = (
      <Portal attach={attach} ref={portalRef}>
        {children}
      </Portal>
    );
  }

  return portal;
});

DrawerWrapper.displayName = 'DrawerWrapper';

export default DrawerWrapper;
