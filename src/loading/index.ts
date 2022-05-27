import _Loading from './Loading';
import { LoadingPlugin as _LoadingPlugin } from './plugin';

import './style/index.js';

export type { LoadingProps } from './Loading';
export * from './type';

export const Loading = _Loading;
export const loading = _LoadingPlugin;
export const LoadingPlugin = _LoadingPlugin;

export default Loading;
