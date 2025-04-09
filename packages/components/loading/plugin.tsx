import React from 'react';
import { render, unmount } from '../_util/react-render';
import Loading, { LoadingProps } from './Loading';
import { LoadingInstance, TdLoadingProps } from './type';
import PluginContainer from '../common/PluginContainer';
import ConfigProvider from '../config-provider';

function createContainer(attach?: TdLoadingProps['attach']) {
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
  const container = createContainer(attach);
  const div = document.createElement('div');
  div.setAttribute('style', 'width: 100%; height: 100%; position: absolute; top: 0;');

  const defaultProps = {
    loading: true,
    attach: null,
    fullscreen: !attach,
    showOverlay: !!attach,
  };

  const dGlobalConfig = ConfigProvider.getGlobalConfig();

  render(<PluginContainer globalConfig={dGlobalConfig}><Loading {...defaultProps} {...props} attach={null}></Loading></PluginContainer>, div);

  container.appendChild(div);

  return {
    hide: () => {
      unmount(div);
      div.remove();
    },
  };
};
