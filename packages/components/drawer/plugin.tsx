import React from 'react';
import { render } from '../_util/react-render';
import DrawerComponent, { DrawerProps } from './Drawer';

import { getAttach } from '../_util/dom';
import { DrawerOptions, DrawerMethod, DrawerInstance } from './type';
import log from '../../common/js/log';

const createDrawer: DrawerMethod = (props: DrawerOptions): DrawerInstance => {
  const drawerRef = React.createRef<DrawerInstance>();
  const options = { ...props };

  // 默认先不出现。如有更好的方法，请代替↓
  const { visible = false } = options;

  const fragment = document.createDocumentFragment();
  render(<DrawerComponent {...(options as DrawerProps)} visible={visible} ref={drawerRef} isPlugin />, fragment);

  const container = getAttach(options.attach);
  if (container) {
    // 抽屉加载出来了再设置出现，才有出现动画。如有更好的方法，请代替↓
    requestAnimationFrame(() => {
      drawerRef.current?.show();
    });
    container.appendChild(fragment);
  } else {
    log.error('Drawer', 'attach is not exist');
  }

  const drawerNode: DrawerInstance = {
    show: () => {
      requestAnimationFrame(() => {
        drawerRef.current?.show();
      });
    },
    hide: () => {
      requestAnimationFrame(() => {
        drawerRef.current?.destroy();
      });
    },
    update: (updateOptions: DrawerOptions) => {
      requestAnimationFrame(() => {
        drawerRef.current?.update(updateOptions);
      });
    },
    destroy: () => {
      requestAnimationFrame(() => {
        drawerRef.current?.destroy();
      });
    },
  };
  return drawerNode;
};

export const DrawerPlugin = createDrawer;
