import React from 'react';
import ConfigProvider,{ ConfigProviderProps } from '../config-provider';

/**
 * 
 * @param notSet 默认不传设置为true，函数是调用唤起组件不需要同步设置全局上下文信息
 * @returns 
 */
const PluginContainer: React.FC<ConfigProviderProps> = (props) => (
  <>
    {props?.globalConfig?.isContextEffectPlugin ? (
      <ConfigProvider notSet {...props}>
        {props?.children}
      </ConfigProvider>
    ) : (
      props?.children
    )}
  </>
);


export default PluginContainer;
