import { forwardRef } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

import type { FC,ForwardRefRenderFunction, RefAttributes } from 'react';

export default function forwardRefWithStatics<P, T = any, S = {}>(
  component: ForwardRefRenderFunction<T, P>,
  statics?: S,
): FC<P & RefAttributes<T>> & S {
  return hoistNonReactStatics(forwardRef(component as any), statics as any) as any;
}
