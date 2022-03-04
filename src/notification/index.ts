import _Notification from './Notification';
import { NotificationPlugin as _NotificationPlugin } from './NotificationPlugin';

import './style/index.js';

export * from './type';

export const Notification = _Notification;
export const notification = _NotificationPlugin;
export const NotificationPlugin = _NotificationPlugin;

export default Notification;
