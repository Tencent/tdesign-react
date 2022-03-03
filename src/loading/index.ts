import _Loading from './loading';
import { LoadingPlugin as _LoadingPlugin, loading as _loading } from './plugin';

import './style/index.js';

export type { LoadingProps } from './loading';
export * from './type';

export const Loading = _Loading;
export const loading = _loading;
export const LoadingPlugin = _LoadingPlugin;

export default Loading;
