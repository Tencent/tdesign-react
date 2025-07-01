import ConfigProvider, { merge } from './ConfigProvider';
import ConfigContext from './ConfigContext';
import { unstableSetRender } from '../_util/react-render';

export type { Config, Locale } from './ConfigContext';
export type { ConfigProviderProps } from './ConfigProvider';
export * from './type';

export { ConfigContext, ConfigProvider, merge, unstableSetRender };
export default ConfigProvider;
