import ConfigContext from './ConfigContext';
import ConfigProvider, { merge } from './ConfigProvider';

export type { Config, Locale } from './ConfigContext';
export type { ConfigProviderProps } from './ConfigProvider';
export * from './type';

export { ConfigContext, ConfigProvider, merge };
export default ConfigProvider;
