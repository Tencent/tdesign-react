import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import classNames from 'classnames';
import Popup from '../popup';
import { TdDrawerProps, DrawerItem, DrawerInstance } from './type';
import parseTNode from '../_util/parseTNode';
import { StyledProps } from '../common';
import { usePrefixClass } from '../hooks/useClass';
import useSetState from '../hooks/useSetState';
import useDefaultProps from '../hooks/useDefaultProps';
import { drawerDefaultProps } from './defaultProps';

export interface DrawerProps extends TdDrawerProps, StyledProps {
  isPlugin?: boolean;
}

const Drawer = forwardRef<DrawerInstance, DrawerProps>((originProps, ref) => {
  const props = useDefaultProps<DrawerProps>(originProps, drawerDefaultProps);
  const [state, setState] = useSetState<DrawerProps>({ isPlugin: false, ...props });

  const {
    destroyOnClose,
    className,
    style,
    items,
    visible,
    title,
    footer,
    showOverlay,
    overlayProps,
    zIndex,
    isPlugin,
    closeOnOverlayClick,
    placement,
    onClose,
    onItemClick,
    onOverlayClick,
  } = state;

  useEffect(() => {
    if (isPlugin) {
      return;
    }
    // 插件式调用不会更新props, 只有组件式调用才会更新props
    setState((prevState) => ({ ...prevState, ...props }));
  }, [props, setState, isPlugin]);

  useImperativeHandle(ref, () => ({
    show() {
      setState({ visible: true });
    },
    hide() {
      setState({ visible: false });
    },
    destroy() {
      setState({ visible: false, destroyOnClose: true });
    },
    update(newOptions) {
      setState((prevState) => ({ ...prevState, ...newOptions }));
    },
  }));

  const drawerClass = usePrefixClass('drawer');

  const handleClose = () => {
    onClose?.('overlay');
  };

  const [show, setShow] = useState(visible);

  const handleOverlayClick = (e) => {
    const context = { e };
    onOverlayClick?.(context);
    if (closeOnOverlayClick) {
      setShow(false);
      handleClose();
    }
  };

  const handleItemClick = (index: number, item: DrawerItem, e: React.MouseEvent<HTMLDivElement>) => {
    const context = { e };
    onItemClick?.(index, item, context);
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const renderTitleNode = () => {
    const titleNode = parseTNode(title);
    return <div className={`${drawerClass}__title`}>{titleNode}</div>;
  };

  const renderFooterNode = () => <div className={`${drawerClass}__footer`}>{footer}</div>;

  return (
    <Popup
      visible={show}
      placement={placement}
      destroyOnClose={destroyOnClose}
      showOverlay={showOverlay}
      overlayProps={overlayProps}
      zIndex={zIndex}
      onVisibleChange={handleOverlayClick}
    >
      <div className={classNames(drawerClass, className)} style={{ ...style }}>
        {title && renderTitleNode()}
        <div className={`${drawerClass}__sidebar`}>
          {items?.map((item, index) => {
            const { title, icon } = item;
            return (
              <div
                key={title}
                className={`${drawerClass}__sidebar-item`}
                onClick={(e) => {
                  handleItemClick(index, item, e);
                }}
              >
                {!!icon && <span className={`${drawerClass}__sidebar-item-icon`}>{parseTNode(icon)}</span>}
                <div className={`${drawerClass}__sidebar-item-title`}>{title}</div>
              </div>
            );
          })}
        </div>
        {footer && renderFooterNode()}
      </div>
    </Popup>
  );
});

Drawer.displayName = 'Drawer';

export default Drawer;
