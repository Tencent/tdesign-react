import './style/index.js';

import _Popup from './Popup';
import _PopupPlugin from './PopupPlugin';

export type { PopupProps, PopupRef } from './Popup';
export * from './type';

export const Popup = _Popup;
export const PopupPlugin = _PopupPlugin;
export default Popup;
