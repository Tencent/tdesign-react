import { fetchListInstance, listMap } from 'tdesign-react/notification/NotificationList';
import {
  NotificationCloseAllMethod,
  NotificationCloseMethod,
  NotificationErrorMethod,
  NotificationInfoMethod,
  NotificationInfoOptions,
  NotificationInstance,
  NotificationOptions,
  NotificationPlacementList,
  NotificationSuccessMethod,
  NotificationThemeList,
  NotificationWarningMethod,
} from 'tdesign-react';

// 扩展接口声明的结构，用户使用时可得到 .info 的 ts 提示
interface Notification {
  (theme: NotificationThemeList, options: NotificationOptions): Promise<NotificationInstance>;
  info: NotificationInfoMethod;
  success: NotificationSuccessMethod;
  warning: NotificationWarningMethod;
  error: NotificationErrorMethod;
  closeAll: NotificationCloseAllMethod;
  close: NotificationCloseMethod;
}

/**
 * @desc 函数调用时的渲染函数
 * @param theme 主题类型
 * @param options 通知的参数
 */
const renderNotification = (theme: NotificationThemeList, options: NotificationInfoOptions) => {
  if (typeof options !== 'object') return;

  const placement: NotificationPlacementList = (() => {
    if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(options.placement) >= 0) {
      return options.placement;
    }
    return 'top-right';
  })();

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

  const zIndex = options.zIndex || 6000;

  return fetchListInstance(placement, attach, zIndex).then((listInstance) => listInstance.push(theme, options));
};

export const NotificationPlugin: Notification = (theme, props) => renderNotification(theme, props);
NotificationPlugin.info = (options) => renderNotification('info', options);
NotificationPlugin.success = (options) => renderNotification('success', options);
NotificationPlugin.warning = (options) => renderNotification('warning', options);
NotificationPlugin.error = (options) => renderNotification('error', options);
NotificationPlugin.close = (promise) => promise.then((instance) => instance.close());
NotificationPlugin.closeAll = () => listMap.forEach((list) => list.removeAll());

export const notification = NotificationPlugin;
