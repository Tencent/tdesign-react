import { createContext } from 'react';
import defaultLocale from '../locale/zh_CN';

export const defaultClassPrefix = 't';

export interface Config {
  /**
   * 组件类名前缀
   *
   * @default 't'
   */
  classPrefix?: string;

  /**
   * 组件语言版本
   *
   * @default defaultLocale
   */
  locale?: object;
}

export const defaultContext = {
  classPrefix: defaultClassPrefix,
  locale: defaultLocale,
};

const ConfigContext = createContext<Config>(defaultContext);

export default ConfigContext;
