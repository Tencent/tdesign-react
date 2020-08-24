import { createContext } from 'react';
import defaultLocale from '../locale/default';
import { Locale } from '../locale-provider';
import { SizeType } from './SizeContext';

// 支持 webpack 注入
export const DEFAULT_CLASS_PREFIX = 't';
export const DEFAULT_LOCALE = 'zh-CN';

export interface ConfigConsumerProps {
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
  locale?: Locale;
  attach?: (triggerNode?: HTMLElement) => HTMLElement;
  componentSize?: SizeType;
}
const ConfigContext = createContext<ConfigConsumerProps>({
  classPrefix: DEFAULT_CLASS_PREFIX,
  locale: defaultLocale,
});
export default ConfigContext;

export const ConfigConsumer = ConfigContext.Consumer;
