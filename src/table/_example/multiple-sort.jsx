import React, { useState } from 'react';
import { Table, Space } from 'tdesign-react';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    sorter: true,
    cell({ row }) {
      switch (row.status) {
        case 0:
          return <p className="status">健康</p>;
        case 1:
          return <p className="status warning">警告</p>;
        case 2:
          return <p className="status unhealth">异常</p>;
        default:
          return null;
      }
    },
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
    width: 200,
    sortType: 'all',
    sorter: true,
  },
  { colKey: 'owner', title: '管理员', width: 100 },
];
const initData = [
  { id: 1, instance: 'JQTest1', status: 0, owner: 'jenny;peter', survivalTime: 1000 },
  { id: 2, instance: 'JQTest2', status: 1, owner: 'jenny', survivalTime: 1000 },
  { id: 3, instance: 'JQTest3', status: 2, owner: 'jenny', survivalTime: 500 },
  { id: 4, instance: 'JQTest4', status: 1, owner: 'peter', survivalTime: 1500 },
];
export default function TableSingleSort() {
  const [sort, setSort] = useState([
    {
      sortBy: 'status',
      descending: true,
    },
    {
      sortBy: 'survivalTime',
      descending: false,
    },
  ]);

  function onSortChange(sort) {
    setSort(sort);
    // Request: 发起远程请求进行排序
    console.log('发起远程请求进行排序（未模拟请求数据）');
  }

  return (
    <Space direction="vertical">
      <div>排序方式：{JSON.stringify(sort)}</div>
      <Table rowKey="id" data={initData} columns={columns} sort={sort} multipleSort onSortChange={onSortChange} />
    </Space>
  );
}
