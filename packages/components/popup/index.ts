import { withZIndexProvider } from '../hooks/useZIndex';

import _Popup from './Popup';
import _PopupPlugin from './PopupPlugin';

import './style/index.js';

export type { PopupProps, PopupRef } from './Popup';
export * from './type';

export const Popup = withZIndexProvider(_Popup, 'popup');
export const PopupPlugin = _PopupPlugin;
export default Popup;
