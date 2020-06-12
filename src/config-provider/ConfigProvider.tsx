import React from 'react';
import ConfigContext, { Config } from './ConfigContext';

export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
}

export default function ConfigProvider({
  children,
  ...configProps
}: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={configProps}>
      {children}
    </ConfigContext.Provider>
  );
}

ConfigProvider.displayName = 'ConfigProvider';
