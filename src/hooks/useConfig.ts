import { useContext } from 'react';
import ConfigContext from '../config-provider/ConfigContext';
import { GlobalConfigProvider } from '../config-provider/type';

// 获取全局 globalConfig
export default (): GlobalConfigProvider => useContext(ConfigContext).globalConfig;
