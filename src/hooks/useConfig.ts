import { useContext } from 'react';
import ConfigContext from '../config-provider/ConfigContext';
import { GlobalConfigProvider } from '../config-provider/type';

export default (): GlobalConfigProvider => useContext(ConfigContext).globalConfig;
