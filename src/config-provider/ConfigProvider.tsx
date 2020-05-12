import React from 'react';
import { ConfigContext, Config } from './ConfigContext';

// ConfigProvider
export interface ConfigProviderProps extends Config {
  children: React.ReactNode;
}

export function ConfigProvider({
  children,
  ...configProps
}: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={configProps}>
      {children}
    </ConfigContext.Provider>
  );
}
