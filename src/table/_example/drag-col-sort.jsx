import React, { useState } from 'react';
import { Table } from 'tdesign-react';

const initialColumns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    cell({ row }) {
      return ['健康', '警告', '异常'][row.status];
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
  const [data] = useState(initData);
  const [columns, setColumns] = useState(initialColumns);

  // currentData is going to be deprecated.
  function onDragSort({ currentIndex, targetIndex, current, target, data, newData, e, sort }) {
    console.log('交换行', currentIndex, targetIndex, current, target, data, newData, e, sort);
    // 数据受控实现
    if (sort === 'col') {
      setColumns(newData);
    }
  }

  // 拖拽排序涉及到 data 的变更，相对比较慎重，因此仅支持受控用法
  return <Table rowKey="id" data={data} columns={columns} dragSort="col" onDragSort={onDragSort} />;
}
