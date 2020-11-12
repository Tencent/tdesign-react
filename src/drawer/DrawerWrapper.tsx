import React, { useRef, forwardRef, useImperativeHandle, cloneElement } from 'react';
import { DrawerProps } from './Drawer';
import Portal, { PortalProps } from './Portal';

export interface DrawerWrapperProps extends PortalProps {
  attach?: DrawerProps['attach'];
  forceRender?: DrawerProps['forceRender'];
  visible?: DrawerProps['visible'];
  children: React.ReactElement;
}

const DrawerWrapper = forwardRef((props: DrawerWrapperProps, ref) => {
  const { children, attach, forceRender, visible } = props;
  const portalRef = useRef<HTMLElement>();
  let portal = null;

  useImperativeHandle(ref, () => {
    if (attach === false && portalRef.current) {
      return portalRef.current.parentNode;
    }

    return portalRef.current;
  });

  if (forceRender || visible || portalRef.current) {
    if (attach === false) {
      // 如果 attach === false,渲染在当前组件节点中。
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
