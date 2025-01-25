import _Tooltip from './Tooltip';
import _TooltipLite from './TooltipLite';

import './style/index.js';

export type { TooltipLiteProps } from './TooltipLite';
export type { TooltipProps } from './Tooltip';
export * from './type';

export const Tooltip = _Tooltip;
export const TooltipLite = _TooltipLite;
export default Tooltip;
