// https://github.com/scottrippey/react-use-event-hook/blob/75ba34af9175dc311afb3fb302d6fea44e4a5203/src/useEvent.ts
// [RFC](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md)
import React from 'react';
import noop from '../_util/noop';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * Suppress the warning when using useLayoutEffect with SSR. (https://reactjs.org/link/uselayouteffect-ssr)
 * Make use of useInsertionEffect if available.
 */
const useInsertionEffect = typeof window !== 'undefined' ? React.useInsertionEffect || React.useLayoutEffect : noop;

/**
 * Render methods should be pure, especially when concurrency is used,
 * so we will throw this error if the callback is called while rendering.
 */
function useEventCallbackShouldNotBeInvokedBeforeMount() {
  throw new Error(
    'INVALID_USEEVENTCALLBACK_INVOCATION: the callback from useEventCallback cannot be invoked before the component has mounted.',
  );
}

/**
 * Similar to useCallback, with a few subtle differences:
 * - The returned function is a stable reference, and will always be the same between renders
 * - No dependency lists required
 * - Properties or state accessed within the callback will always be "current"
 */
export default function useEventCallback<TCallback extends AnyFunction>(callback: TCallback): TCallback {
  // Keep track of the latest callback:
  const latestRef = React.useRef<TCallback>(useEventCallbackShouldNotBeInvokedBeforeMount as any);
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);

  // Create a stable callback that always calls the latest callback:
  // using useRef instead of useCallback avoids creating and empty array on every render
  const stableRef = React.useRef<TCallback>(null as any);
  if (!stableRef.current) {
    stableRef.current = function (this: unknown, ...args: unknown[]) {
      return latestRef.current.apply(this, args);
    } as TCallback;
  }

  return stableRef.current;
}
