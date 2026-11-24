import React, { useMemo } from 'react';
import type { AvatarGroupProps } from './AvatarGroup';

export const AvatarGroupContext = React.createContext(null);

export function AvatarGroupContextProvider(props: Pick<AvatarGroupProps, 'size' | 'children' | 'shape'>) {
  const memoInfo = useMemo(
    () => ({
      size: props.size,
      shape: props.shape,
    }),
    [props.size, props.shape],
  );
  return <AvatarGroupContext.Provider value={memoInfo}>{props.children}</AvatarGroupContext.Provider>;
}
