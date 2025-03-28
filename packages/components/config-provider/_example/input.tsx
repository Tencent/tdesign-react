import React from 'react';
import { ConfigProvider, Input } from 'tdesign-react';
import type { GlobalConfigProvider } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig: GlobalConfigProvider = {
    ...enConfig,
    input: {
      clearTrigger: 'always',
      placeholder: 'Always show clear icon when input has value',
    },
  };

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Input />
    </ConfigProvider>
  );
}
