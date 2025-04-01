import { createContext } from 'react';
import { merge } from 'lodash-es';
import defaultConfig from '@tdesign/common-js/global-config/default-config';
import defaultLocale from '../locale/zh_CN';
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

export const defaultGlobalConfig: GlobalConfigProvider = {
  animation: defaultAnimation,
  classPrefix: defaultClassPrefix,
  ...merge({}, defaultLocale, defaultConfig),
};

export type Locale = typeof defaultLocale;

export const defaultContext = {
  globalConfig: defaultGlobalConfig,
};

export type Config = typeof defaultContext;

const ConfigContext = createContext(defaultContext);

export default ConfigContext;
