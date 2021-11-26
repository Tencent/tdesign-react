import _Dialog from './Dialog';

import './style/index.js';

export type { DialogProps } from './Dialog';
export * from '../_type/components/dialog';

export { default as dialog } from './plugin';
export const Dialog = _Dialog;
export default Dialog;
