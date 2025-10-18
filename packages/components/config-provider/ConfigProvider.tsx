import { mergeWith as _mergeWith, cloneDeep } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import ConfigContext, { Config, defaultGlobalConfig, InternalConfigContext } from './ConfigContext';
import type { GlobalConfigProvider } from './type';

export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
  /**
   * 不需要设置全局上下文信息
   * 不传或者false：表示全局上下文变动，需要更新全局上下文的信息放入到变量中
   * true：表示全局上下文信息不需要重新设置，
   * 解决问题：当plugin调用的时候，单独包裹的Provider 也会传全局变量，仅自身可用，多次调用时相互之间不会冲突。
   * 插件单独的config方法依然可用。自身属性通过props传递
   * 例如：多处调用message.config 如果每次都更新全局上下文，插件调用时配置会相互影响，导致行为结果跟预期不一致。
   */
  notSet?: boolean;
}

// deal with https://github.com/lodash/lodash/issues/1313
export const merge = (src: GlobalConfigProvider, config: GlobalConfigProvider) =>
  _mergeWith(src, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
  });

// 存放全局的上下文配置
let globalConfig = defaultGlobalConfig;

export const getGlobalConfig = (configInfo?: GlobalConfigProvider): GlobalConfigProvider =>
  merge({ ...globalConfig }, configInfo);

export const setGlobalConfig = (configInfo?: GlobalConfigProvider) => {
  globalConfig = configInfo;
};

export default function ConfigProvider({
  children,
  globalConfig,
  notSet,
  autoZIndex,
  onZIndexChange,
}: ConfigProviderProps) {
  const defaultData = cloneDeep(defaultGlobalConfig);
  const mergedGlobalConfig = merge(defaultData, globalConfig);

  const [globalZIndex, setGlobalZIndex] = useState<number>(0);

  useEffect(() => {
    if (!notSet) {
      // 需要设置的情况下，当配置信息变化时更新变量中的配置信息，方便plugin调用时获取
      setGlobalConfig(mergedGlobalConfig);
    }
  }, [mergedGlobalConfig, notSet]);

  useEffect(() => {
    onZIndexChange?.(globalZIndex);
  }, [globalZIndex, onZIndexChange]);

  const externalContextValue = {
    globalConfig: mergedGlobalConfig,
  };

  const internalContextValue = {
    autoZIndex,
    globalZIndex,
    setGlobalZIndex,
  };

  return (
    <ConfigContext.Provider value={externalContextValue}>
      <InternalConfigContext.Provider value={internalContextValue}>{children}</InternalConfigContext.Provider>
    </ConfigContext.Provider>
  );
}

ConfigProvider.getGlobalConfig = getGlobalConfig;
ConfigProvider.setGlobalConfig = setGlobalConfig;

ConfigProvider.displayName = 'ConfigProvider';
