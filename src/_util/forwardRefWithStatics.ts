import React, { RefAttributes, forwardRef } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

export default function forwardRefWithStatics<P, T = any, S = {}>(
  component: React.ForwardRefRenderFunction<T, P>,
  statics?: S,
): React.FunctionComponent<P & RefAttributes<T>> & S {
  return hoistNonReactStatics(forwardRef(component), statics as any) as any;
}
