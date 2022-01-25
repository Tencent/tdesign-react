import React from 'react';
import _merge from 'lodash/merge';
import ConfigContext, { Config, defaultGlobalConfig } from './ConfigContext';

export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
}

export const merge = _merge;
export default function ConfigProvider({ children, globalConfig }: ConfigProviderProps) {
  const mergedGlobalConfig = merge(defaultGlobalConfig, globalConfig);
  return <ConfigContext.Provider value={{ globalConfig: mergedGlobalConfig }}>{children}</ConfigContext.Provider>;
}

ConfigProvider.displayName = 'ConfigProvider';
