import ConfigProvider, { merge } from './ConfigProvider';
import ConfigContext from './ConfigContext';
import { renderAdapter } from '../_util/react-render';

export type { Config, Locale } from './ConfigContext';
export type { ConfigProviderProps } from './ConfigProvider';
export * from './type';

export { ConfigContext, ConfigProvider, merge, renderAdapter };
export default ConfigProvider;
