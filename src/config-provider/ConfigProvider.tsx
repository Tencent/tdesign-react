import React from 'react';
import { mergeWith as _mergeWith } from 'lodash-es';
import ConfigContext, { defaultGlobalConfig, Config } from './ConfigContext';
import { GlobalConfigProvider } from './type';

export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
}

// deal with https://github.com/lodash/lodash/issues/1313
export const merge = (src: GlobalConfigProvider, config: GlobalConfigProvider) =>
  _mergeWith(src, config, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return srcValue;
    }
  });

export default function ConfigProvider({ children, globalConfig }: ConfigProviderProps) {
  const mergedGlobalConfig = merge({ ...defaultGlobalConfig }, globalConfig);
  return <ConfigContext.Provider value={{ globalConfig: mergedGlobalConfig }}>{children}</ConfigContext.Provider>;
}

ConfigProvider.displayName = 'ConfigProvider';
