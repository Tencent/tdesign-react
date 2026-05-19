import './style/index.js';

import _Loading from './Loading';
import { LoadingPlugin as _LoadingPlugin } from './plugin';

export type { LoadingProps } from './Loading';
export * from './type';

export const Loading = _Loading;
export const loading = _LoadingPlugin;
export const LoadingPlugin = _LoadingPlugin;

export default Loading;
