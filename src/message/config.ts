import { MessageOptions } from './type';
import { messageDefaultProps } from './defaultProps';

/**
 * @name: globalConfig
 * @description: message 组件全局的默认配置
 * */
export const globalConfig = {
  top: 32,
};

// 全局默认配置，zIndex 为 5000，默认关闭时间 3000ms
let messageDefaultConfig: MessageOptions = {
  ...messageDefaultProps,
  duration: 3000,
  placement: 'top',
  zIndex: 5000,
};

/**
 * @name: getMessageConfig
 * @description: 组合 currentOptions 和 defaultConfig 拼装成最终生效的 options
 * 保证所有的配置出口都通过该函数，当后续封装 globalConfig 时从此处添加即可全局生效
 * @param: options MessageOptions
 * @return: MessageOptions
 * @todo: options 合法性检测
 * */
export const getMessageConfig = (options: MessageOptions): MessageOptions => {
  const currentOptions = { ...options };

  // :todo 判断传入参数的合法性，本期先过滤掉明显非法的数据，比如 undefined
  for (const i in currentOptions) {
    if (typeof currentOptions[i] === 'undefined') {
      delete currentOptions[i];
    }
  }

  // duration 判断
  if (typeof currentOptions.duration !== 'number' || currentOptions.duration < 0) {
    delete currentOptions.duration;
  }

  return {
    ...messageDefaultConfig,
    ...currentOptions,
  };
};

/**
 * @name: setGlobalConfig
 * @description: 设置全局配置
 * */
export const setGlobalConfig = (options: MessageOptions) => {
  messageDefaultConfig = {
    ...getMessageConfig(options),
  };
};

/**
 * @name: getMessageDefaultConfig
 * @description: 获取默认的消息配置，不允许更改
 * @return: MessageOptions
 * */
export const getMessageDefaultConfig = (): MessageOptions => ({ ...messageDefaultConfig });
