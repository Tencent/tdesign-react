import { NotificationOptions } from './type';
import { notificationDefaultProps } from './defaultProps';

let pluginDefaultConfig: NotificationOptions = {
  ...notificationDefaultProps,
  zIndex: 6000,
  placement: 'top-right',
  offset: ['16px', '16px'],
};

export const getConfig = (options: NotificationOptions): NotificationOptions => {
  const currentOptions = { ...options };

  for (const i in currentOptions) {
    if (typeof currentOptions[i] === 'undefined') {
      delete currentOptions[i];
    }
  }

  // duration 判断
  if (typeof currentOptions.duration !== 'number' || currentOptions.duration < 0) {
    delete currentOptions.duration;
  }

  // placement 判断
  if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(currentOptions.placement) < 0) {
    delete currentOptions.placement;
  }

  // theme 判断
  if (['info', 'success', 'warning', 'error'].indexOf(currentOptions.theme) < 0) {
    delete currentOptions.theme;
  }

  // offset 判断
  if (!Array.isArray(currentOptions.offset)) {
    delete currentOptions.offset;
  }

  return {
    ...pluginDefaultConfig,
    ...currentOptions,
  };
};

/**
 * @name: setGlobalConfig
 * @description: 设置全局配置
 * */
export const setGlobalConfig = (options: NotificationOptions) => {
  pluginDefaultConfig = {
    ...getConfig(options),
  };
};

/**
 * @name: getDefaultConfig
 * @description: 获取默认的消息配置，不允许更改
 * @return: NotificationOptions
 * */
export const getDefaultConfig = (): NotificationOptions => ({ ...pluginDefaultConfig });
