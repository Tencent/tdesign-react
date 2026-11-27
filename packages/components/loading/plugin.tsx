import React from 'react';

import { render, unmount } from '../_util/react-render';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';
import Loading from './Loading';

import type { LoadingProps } from './Loading';
import type { LoadingInstance, TdLoadingProps } from './type';

function createContainer(attach?: TdLoadingProps['attach']): HTMLElement | null {
  if (typeof attach === 'string') return document.querySelector(attach);
  if (typeof attach === 'function') return attach();
  return document.body;
}

export type LoadingPluginMethod = (options: boolean | LoadingProps) => LoadingInstance;

// loading plugin形式
export const LoadingPlugin: LoadingPluginMethod = (options) => {
  if (options === false) return { hide: () => null };

  const props = typeof options === 'boolean' ? {} : options;
  const { attach } = props;
  const resolvedContainer = createContainer(attach);
  // attach 指向的节点可能尚未挂载（例如子应用容器还没渲染），此时退回 body，
  // 避免 container.appendChild 抛 Cannot read properties of null（issue #3360）。
  const container = resolvedContainer ?? document.body;
  const attached = !!attach && !!resolvedContainer;
  const div = document.createElement('div');
  div.setAttribute('style', 'width: 100%; height: 100%; position: absolute; top: 0;');

  const defaultProps = {
    loading: true,
    attach: null,
    fullscreen: !attached,
    showOverlay: attached,
  };

  const dGlobalConfig = ConfigProvider.getGlobalConfig();

  render(
    <PluginContainer globalConfig={dGlobalConfig}>
      <Loading {...defaultProps} {...props} attach={null}></Loading>
    </PluginContainer>,
    div,
  );

  container.appendChild(div);

  return {
    hide: () => {
      unmount(div);
      div.remove();
    },
  };
};
