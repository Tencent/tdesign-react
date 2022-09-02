import { fetchListInstance, listMap } from './NotificationList';
import {
  NotificationCloseAllMethod,
  NotificationCloseMethod,
  NotificationErrorMethod,
  NotificationInfoMethod,
  NotificationInfoOptions,
  NotificationInstance,
  NotificationOptions,
  NotificationSuccessMethod,
  NotificationThemeList,
  NotificationWarningMethod,
  NotificationConfigMethod,
} from './type';

import { getConfig, setGlobalConfig } from './config';

// 扩展接口声明的结构，用户使用时可得到 .info 的 ts 提示
export interface Notification {
  (theme: NotificationThemeList, options: NotificationOptions): Promise<NotificationInstance>;
  info: NotificationInfoMethod;
  success: NotificationSuccessMethod;
  warning: NotificationWarningMethod;
  error: NotificationErrorMethod;
  closeAll: NotificationCloseAllMethod;
  close: NotificationCloseMethod;
  config: NotificationConfigMethod;
}

/**
 * @desc 函数调用时的渲染函数
 * @param theme 主题类型
 * @param options 通知的参数
 */
const renderNotification = (theme: NotificationThemeList, options: NotificationInfoOptions) => {
  if (typeof options !== 'object') return;

  const configs = getConfig(options);
  const { placement } = configs;

  const attach: HTMLElement = (() => {
    if (options.attach && typeof options.attach === 'string') {
      const element: Element = document.querySelector(options.attach);
      if (element instanceof HTMLElement) return element;
    }

    if (options.attach instanceof HTMLElement) return options.attach;

    const containerId = `tdesign-notification-${placement}`;
    const container = document.querySelector(`#${containerId}`);
    if (container && container instanceof HTMLElement) {
      return container;
    }

    const element: HTMLDivElement = document.createElement('div');
    element.setAttribute('id', containerId);
    document.body.appendChild(element);
    return element;
  })();

  return fetchListInstance(placement, attach, configs.zIndex).then((listInstance) => listInstance.push(theme, configs));
};

export const NotificationPlugin: Notification = (theme, props) => renderNotification(theme, props);
NotificationPlugin.info = (options) => renderNotification('info', options);
NotificationPlugin.success = (options) => renderNotification('success', options);
NotificationPlugin.warning = (options) => renderNotification('warning', options);
NotificationPlugin.error = (options) => renderNotification('error', options);
NotificationPlugin.close = (promise) => promise.then((instance) => instance.close());
NotificationPlugin.closeAll = () => listMap.forEach((list) => list.removeAll());
NotificationPlugin.config = (options) => setGlobalConfig(options);
