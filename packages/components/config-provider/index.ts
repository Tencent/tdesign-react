import ConfigProvider, { merge } from './ConfigProvider';
import ConfigContext from './ConfigContext';

export type { Config, Locale } from './ConfigContext';
export type { ConfigProviderProps } from './ConfigProvider';
export * from './type';

export { ConfigContext, ConfigProvider, merge };
export default ConfigProvider;
