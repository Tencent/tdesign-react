import './style/index.js';

import _Tooltip from './Tooltip';
import _TooltipLite from './TooltipLite';

export type { TooltipProps } from './Tooltip';
export type { TooltipLiteProps } from './TooltipLite';
export * from './type';

export const Tooltip = _Tooltip;
export const TooltipLite = _TooltipLite;
export default Tooltip;
