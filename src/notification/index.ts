import _Notification from './Notification';

import './style/index.js';

export type {
  NotificationThemeList,
  NotificationPlacementList,
  NotificationInstance,
  NotificationInfoOptions,
  NotificationMethod,
  TdNotificationProps as NotificationProps,
} from '../_type/components/notification';

export const Notification = _Notification;
export default Notification;
