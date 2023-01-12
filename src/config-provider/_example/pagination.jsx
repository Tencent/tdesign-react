import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, Pagination } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
    pagination: {
      itemsPerPage: '{size} / page',
      jumpTo: 'jump to',
      total: 'Total {total} items',
    },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Pagination total={36} showJumper maxPageBtn={5} />
    </ConfigProvider>
  );
}
