import React, { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

/**
 * 基于 Hook 创建一个 Context
 * @param hook
 * @returns
 */
export function createHookContext<T, P>(hook: (value: P) => T) {
  const Context = createContext<T>(null);

  function Provider(
    props: PropsWithChildren<{
      value: P;
    }>,
  ) {
    return <Context.Provider value={hook(props.value)}>{props.children}</Context.Provider>;
  }

  function use() {
    return useContext(Context);
  }

  return {
    Provider,
    use,
  };
}
