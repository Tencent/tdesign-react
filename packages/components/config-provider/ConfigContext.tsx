import { createContext } from 'react';
import { merge } from 'lodash-es';
import defaultConfig from '@tdesign/common-js/global-config/default-config';
import defaultLocale from '../locale/zh_CN';
import type { GlobalConfigProvider } from './type';

export enum EAnimationType {
  ripple = 'ripple',
  expand = 'expand',
  fade = 'fade',
}

export const defaultClassPrefix = 't';

export const defaultAnimation = {
  include: [EAnimationType.ripple, EAnimationType.expand, EAnimationType.fade],
  exclude: [],
};

export const defaultGlobalConfig: GlobalConfigProvider = {
  animation: defaultAnimation,
  classPrefix: defaultClassPrefix,
  ...merge({}, defaultLocale, defaultConfig),
};
export type Locale = typeof defaultLocale;

export interface Config {
  globalConfig?: GlobalConfigProvider;
  autoZIndex?: boolean;
  onZIndexChange?: (zIndex: number) => void;
}

export interface InternalConfig {
  globalZIndex?: number;
  autoZIndex?: boolean;
  setGlobalZIndex?: (zIndex: number) => void;
}

export const defaultContext: Config = {
  globalConfig: defaultGlobalConfig,
};

export const defaultInternalContext: InternalConfig = {
  globalZIndex: 0,
  setGlobalZIndex: undefined,
};

// 供用户使用
const ConfigContext = createContext<Config>(defaultContext);

// 供内部全局变量使用
export const InternalConfigContext = createContext<InternalConfig>(defaultInternalContext);

export default ConfigContext;
