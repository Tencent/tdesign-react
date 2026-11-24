import React, { createRef } from 'react';
import { render, unmount } from '../_util/react-render';
import Drawer, { DrawerProps } from './Drawer';
import { DrawerInstance, TdDrawerProps, DrawerOptions } from './type';

function createContainer(attach?: TdDrawerProps['attach']) {
  if (typeof attach === 'string') return document.querySelector(attach);
  if (typeof attach === 'function') return attach();
  return document.body;
}

export type DrawerPluginMethod = (options: boolean | DrawerProps) => DrawerInstance;

export const DrawerPlugin = (options) => {
  const props = typeof options === 'boolean' ? {} : options;
  const { attach } = props;
  const defaultProps = {
    ...props,
  };
  const { visible = false } = defaultProps;
  if (options === false) return { hide: () => null };

  const container = createContainer(attach);
  const div = document.createElement('div');
  const dialogRef = createRef<DrawerInstance>();

  render(<Drawer ref={dialogRef} {...defaultProps} visible={visible} isPlugin />, div);
  container.appendChild(div);

  return {
    show: () => {
      requestAnimationFrame(() => {
        container.appendChild(div);
        dialogRef.current?.show();
      });
    },
    hide: () => {
      requestAnimationFrame(() => {
        dialogRef.current?.destroy();
      });
    },
    update(updateOptions: DrawerOptions) {
      requestAnimationFrame(() => {
        dialogRef.current?.update(updateOptions);
      });
    },
    destroy: () => {
      requestAnimationFrame(() => {
        dialogRef.current?.destroy();
        unmount(div);
      });
    },
  };
};
