import { useContext } from 'react';
import ConfigContext, { GlobalConfig } from '../config-provider/ConfigContext';

export default (): GlobalConfig => useContext(ConfigContext).globalConfig;
