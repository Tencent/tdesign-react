import React, { useState } from 'react';
import { Table } from '@tencent/tdesign-react';
import './single-sort.less';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    sorter: true,
    render({ row }) {
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
  const [data, setData] = useState([...initData]);
  const [sort, setSort] = useState({
    // 按照 status 字段进行排序
    sortBy: 'status',
    // 是否按照降序进行排序
    descending: true,
  });

  function onSortChange(sort) {
    setSort(sort);
    request(sort);
  }
  function request(sort) {
    // 模拟异步请求，进行数据排序
    const timer = setTimeout(() => {
      if (!sort || !sort.sortBy) {
        setData([...initData]);
        return;
      }
      const dataNew = initData
        .concat()
        .sort((a, b) =>
          sort.descending
            ? String(a[sort.sortBy]).localeCompare(String(b[sort.sortBy]))
            : String(b[sort.sortBy]).localeCompare(String(a[sort.sortBy])),
        );
      setData([...dataNew]);
      clearTimeout(timer);
    }, 100);
  }

  return (
    <div className="demo-container">
      <div style={{ marginBottom: '16px' }}>排序方式：{JSON.stringify(sort)}</div>
      <Table rowKey="id" data={data} columns={columns} sort={sort} onSortChange={onSortChange} />
    </div>
  );
}
