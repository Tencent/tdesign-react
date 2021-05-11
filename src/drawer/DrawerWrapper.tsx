import React, { useRef, forwardRef, useImperativeHandle, cloneElement } from 'react';
import Portal, { PortalProps } from '../common/Portal';
import { DrawerProps } from './Drawer';

export interface DrawerWrapperProps extends PortalProps {
  attach?: DrawerProps['attach'];
  visible?: DrawerProps['visible'];
  children: React.ReactElement;
}

const DrawerWrapper = forwardRef((props: DrawerWrapperProps, ref) => {
  const { children, attach, visible } = props;
  const portalRef = useRef<HTMLElement>();
  let portal = null;

  useImperativeHandle(ref, () => {
    if (attach === '' && portalRef.current) {
      return portalRef.current.parentNode;
    }

    return portalRef.current;
  });

  if (visible || portalRef.current) {
    if (attach === '') {
      // 如果 attach === '',渲染在当前组件节点中。
      portal = <span ref={portalRef}>{cloneElement(children)}</span>;
    } else {
      portal = (
        <Portal getContainer={attach} ref={portalRef}>
          {children}
        </Portal>
      );
    }
  }
  return portal;
});
DrawerWrapper.displayName = 'DrawerWrapper';
export default DrawerWrapper;
