import { createContext } from 'react';
import { merge } from 'lodash-es';
import defaultConfig from '@tdesign/common-js/global-config/mobile/default-config';

import defaultLocale from '../locale/zh_CN';

import type { GlobalConfigProvider } from './type';

export const defaultClassPrefix = 't';

type DefaultGlobalConfig = Partial<GlobalConfigProvider>;

export const defaultGlobalConfig: DefaultGlobalConfig = {
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
