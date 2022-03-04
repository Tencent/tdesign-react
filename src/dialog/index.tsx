import _Dialog from './Dialog';
import { DialogPlugin as _DialogPlugin } from './plugin';

import './style/index.js';

export type { DialogProps } from './Dialog';
export * from './type';

export const Dialog = _Dialog;
export const dialog = _DialogPlugin;
export const DialogPlugin = _DialogPlugin;

export default Dialog;
