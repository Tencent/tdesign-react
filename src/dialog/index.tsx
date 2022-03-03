import _Dialog from './Dialog';
import { DialogPlugin as _DialogPlugin, dialog as _dialog } from './plugin';

import './style/index.js';

export type { DialogProps } from './Dialog';
export * from './type';

export const Dialog = _Dialog;
export const DialogPlugin = _DialogPlugin;
export const dialog = _dialog;
export default Dialog;
