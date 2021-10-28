import React from 'react';
import ConfigContext, { Config, defaultContext } from './ConfigContext';

export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
}

export default function ConfigProvider({ children, ...configProps }: ConfigProviderProps) {
  return <ConfigContext.Provider value={{ ...defaultContext, ...configProps }}>{children}</ConfigContext.Provider>;
}

ConfigProvider.displayName = 'ConfigProvider';
