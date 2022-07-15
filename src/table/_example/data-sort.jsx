import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'tdesign-react';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    sorter: (a, b) => a.status - b.status,
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
    sortType: 'desc',
    sorter: (a, b) => a.survivalTime - b.survivalTime,
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
  const [data, setData] = useState(initData);
  const [sortInfo, setSortInfo] = useState({ sortBy: 'survivalTime', descending: true });
  const [multipleSort, setMultipleSort] = useState(false);

  function onSortChange(sort, options) {
    console.log(sort, options);
    setSortInfo(sort);
    setData(options.currentDataSource);
  }

  return (
    <Space direction="vertical">
      <Checkbox style={{ marginBottom: 16 }} value={multipleSort} onChange={setMultipleSort}>
        是否允许多字段排序
      </Checkbox>
      <Table
        rowKey="id"
        data={data}
        columns={columns}
        sort={sortInfo}
        multipleSort={multipleSort}
        onSortChange={onSortChange}
      />
    </Space>
  );
}
