import { createContext } from 'react';

// 支持 webpack 注入
export const DEFAULT_CLASS_PREFIX = 't';
export const DEFAULT_LOCALE = 'zh-CN';

export interface Config {
  /**
   * 组件类名前缀
   *
   * @default "tdesign"
   */
  classPrefix?: string;

  /**
   * 组件语言版本
   *
   * @default "zh-CN"
   */
  locale?: 'zh-CN';
}

const ConfigContext = createContext<Config>({
  classPrefix: DEFAULT_CLASS_PREFIX,
  locale: DEFAULT_LOCALE,
});

export default ConfigContext;
