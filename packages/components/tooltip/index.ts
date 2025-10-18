import { withZIndexProvider } from '../hooks/useZIndex';

import _Tooltip from './Tooltip';
import _TooltipLite from './TooltipLite';

import './style/index.js';

export type { TooltipProps } from './Tooltip';
export type { TooltipLiteProps } from './TooltipLite';
export * from './type';

export const Tooltip = withZIndexProvider(_Tooltip, 'tooltip');
export const TooltipLite = _TooltipLite;
export default Tooltip;
