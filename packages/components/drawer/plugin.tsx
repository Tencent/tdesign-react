import React from 'react';
import log from '@tdesign/common-js/log/index';

import { getAttach } from '../_util/dom';
import { render } from '../_util/react-render';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';
import DrawerComponent from './Drawer';

import type { DrawerProps } from './Drawer';
import type { DrawerInstance, DrawerMethod, DrawerOptions } from './type';

const createDrawer: DrawerMethod = (props: DrawerOptions): DrawerInstance => {
  const drawerRef = React.createRef<DrawerInstance>();

  // 默认先不打开。如有更好的方法，请代替↓
  const { visible = false } = props;

  const fragment = document.createDocumentFragment();

  const dGlobalConfig = ConfigProvider.getGlobalConfig();
  render(
    <PluginContainer globalConfig={dGlobalConfig}>
      <DrawerComponent {...(props as DrawerProps)} visible={visible} ref={drawerRef} isPlugin />
    </PluginContainer>,
    fragment,
  );

  const container = getAttach(props.attach);
  if (container) {
    // 加载出来了再设置打开，打开才有动画。如有更好的方法，请代替↓
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
