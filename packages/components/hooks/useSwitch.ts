import { useState } from 'react';
import { usePersistFn } from './usePersistFn';

/**
 * 开关状态
 * @param initialState
 * @returns [state, actions]
 */
const useSwitch = (initialState = false) => {
  const [state, setState] = useState(initialState);

  return [
    state,
    {
      on: usePersistFn(() => setState(true)),
      off: usePersistFn(() => setState(false)),
      set: setState,
    },
  ] as const;
};

export default useSwitch;
