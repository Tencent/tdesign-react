import React, { useState } from 'react';
import { Table } from 'tdesign-react';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
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
  },
  { colKey: 'owner', title: '管理员', width: 100 },
];
const initData = [
  { id: 1, instance: 'JQTest1', status: 0, owner: 'jenny;peter', survivalTime: 1000 },
  { id: 2, instance: 'JQTest2', status: 1, owner: 'jenny', survivalTime: 1000 },
  { id: 3, instance: 'JQTest3', status: 2, owner: 'jenny', survivalTime: 500 },
  { id: 4, instance: 'JQTest4', status: 1, owner: 'peter', survivalTime: 1500 },
];
export default function TableDragSort() {
  const [data, setData] = useState(initData);

  // currentData is going to be deprecated.
  function onDragSort({ currentIndex, targetIndex, current, target, data, newData, e }) {
    console.log('交换行', currentIndex, targetIndex, current, target, data, newData, e);
    // 数据受控实现
    setData(newData);
  }

  // 拖拽排序涉及到 data 的变更，相对比较慎重，因此仅支持受控用法
  return <Table rowKey="id" data={data} columns={columns} dragSort="row" onDragSort={onDragSort} />;
}
