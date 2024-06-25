import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, Table, Space } from 'tdesign-react';
import { ChevronRightIcon, CaretDownSmallIcon } from 'tdesign-icons-react';
import enConfig from 'tdesign-react/es/locale/en_US';

const columns = [
  {
    colKey: 'type',
    title: 'Type',
    sorter: true,
  },
  {
    colKey: 'platform',
    title: 'Platform',
    filter: {
      type: 'single',
    },
  },
  {
    colKey: 'property',
    title: 'Property',
    sorter: true,
    filter: {
      type: 'single',
    },
  },
];

const data = [
  { type: 'Array', platform: 'Vue(PC)', property: 'A' },
  { type: 'String', platform: 'React(PC)', property: 'B' },
  { type: 'Object', platform: 'Miniprogram', property: 'C' },
];

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
    table: {
      // 支持 String 和 Function 两种数据类型
      empty: 'Empty Data',
      expandIcon: () => <ChevronRightIcon />,
      sortIcon: () => <CaretDownSmallIcon size="18px" />,

      // More config
      // filterIcon: () => <span>Filter</span>,
      // filterInputPlaceholder: 'Enter Keyword',
      // loadingMoreText: 'Load More',
      // loadingText: 'Loading',
      // sortAscendingOperationText: 'ascending sort',
      // sortCancelOperationText: 'cancel sort',
      // sortDescendingOperationText: 'descending sort',
      // treeExpandAndFoldIcon: (h, { type }) => type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />,
    },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <Table data={[]} columns={columns} bordered rowKey="property"></Table>

        <Table data={data} columns={columns} rowKey="property"></Table>
      </Space>
    </ConfigProvider>
  );
}
