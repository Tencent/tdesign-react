import { useCallback, useState } from 'react';

const isFunction = (arg: unknown) => typeof arg === 'function';

/**
 * 管理 object 类型 state 的 Hooks，用法与 class 组件的 this.setState 基本一致。
 * @param initialState
 * @returns [state, setMergeState]
 */
const useSetState = <T extends object>(
  initialState: T = {} as T,
): [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void] => {
  const [state, setState] = useState<T>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => ({ ...prevState, ...(isFunction(patch) ? patch(prevState) : patch) }));
  }, []);

  return [state, setMergeState];
};

export default useSetState;
