import React from 'react';

const AvatarContext = React.createContext('default');

export interface AvatarContextProps {
  size?: string;
  children?: React.ReactNode;
}

export const AvatarContextProvider: React.FC<AvatarContextProps> = ({ children, size }) => (
  <AvatarContext.Consumer>
    {(inputSize) => <AvatarContext.Provider value={size || inputSize}>{children}</AvatarContext.Provider>}
  </AvatarContext.Consumer>
);

export default AvatarContext;
