import { createContext } from 'react';
import merge from 'lodash/merge';
import defaultLocale from '../locale/zh_CN';
import defaultConfig from '../_common/js/global-config/default-config';
import { GlobalConfigProvider } from './type';

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

export const defaultGlobalConfig = {
  animation: defaultAnimation,
  classPrefix: defaultClassPrefix,
  ...merge(defaultLocale, defaultConfig),
};

export type Locale = typeof defaultLocale;

export type GlobalConfig = typeof defaultGlobalConfig;
export interface Config {
  globalConfig?: GlobalConfigProvider;
}

export const defaultContext: { globalConfig: GlobalConfig } = {
  globalConfig: defaultGlobalConfig,
};

const ConfigContext = createContext(defaultContext);

export default ConfigContext;
