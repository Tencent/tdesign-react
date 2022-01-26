import { createContext } from 'react';
import merge from 'lodash/merge';
import defaultLocale from '../locale/zh_CN';
import DEFAULT_GLOBAL_CONFIG from './defaultConfig';

export const defaultClassPrefix = 't';

export const defaultGlobalConfig = {
  classPrefix: defaultClassPrefix,
  ...merge(defaultLocale, DEFAULT_GLOBAL_CONFIG),
};

export type Locale = typeof defaultLocale;

export type GlobalConfig = typeof defaultGlobalConfig;

export interface Config {
  globalConfig?: GlobalConfig;
}

export const defaultContext = {
  globalConfig: defaultGlobalConfig,
};

const ConfigContext = createContext(defaultContext);

export default ConfigContext;
