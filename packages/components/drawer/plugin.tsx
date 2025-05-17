import React from 'react';
import log from '@tdesign/common-js/log/index';
import { render } from '../_util/react-render';
import DrawerComponent, { DrawerProps } from './Drawer';

import { getAttach } from '../_util/dom';
import type { DrawerOptions, DrawerMethod, DrawerInstance } from './type';
import ConfigProvider from '../config-provider';
import PluginContainer from '../common/PluginContainer';

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

  const showDrawer = () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        drawerRef.current?.show();
      });
    }, 0);
  };

  const container = getAttach(props.attach);
  if (container) {
    // 加载出来了再设置打开，打开才有动画。如有更好的方法，请代替↓
    container.appendChild(fragment);
    showDrawer();
  } else {
    log.error('Drawer', 'attach is not exist');
  }

  const drawerNode: DrawerInstance = {
    show: () => {
      showDrawer();
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
