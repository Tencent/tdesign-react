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

export interface Config {
  globalConfig?: typeof defaultGlobalConfig;
}

export const defaultContext = {
  globalConfig: defaultGlobalConfig,
};

const ConfigContext = createContext<Config>(defaultContext);

export default ConfigContext;
