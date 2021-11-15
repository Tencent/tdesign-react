import React, { useState } from 'react';
import { Table } from 'tdesign-react';

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    // disabled 参数：{row: RowData; rowIndex: number })
    disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,
    width: 50,
  },
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cell({ row }) {
      switch (row?.status) {
        case 0:
          return <p className="status">健康</p>;
        case 1:
          return <p className="status unhealth">异常</p>;
        default:
          return null;
      }
    },
  },
  { colKey: 'owner', title: '管理员' },
  { colKey: 'description', title: '描述' },
  {
    colKey: 'op',
    width: 200,
    title: '操作',
    cell(record) {
      return (
        <>
          <a
            className="link"
            onClick={() => {
              rehandleClickOp(record);
            }}
          >
            管理
          </a>
          <a
            className="link"
            onClick={() => {
              rehandleClickOp(record);
            }}
          >
            删除
          </a>
        </>
      );
    },
  },
];
const initData = [
  {
    id: 1,
    instance: 'JQTest1',
    status: 0,
    owner: 'jenny;peter',
    description: 'test',
  },
  {
    id: '2',
    instance: 'JQTest2',
    status: 1,
    owner: 'jenny',
    description: 'test',
  },
  {
    id: 3,
    instance: 'JQTest3',
    status: 0,
    owner: 'jenny',
    description: 'test',
  },
  {
    id: 4,
    instance: 'JQTest4',
    status: 1,
    owner: 'peter',
    description: 'test',
  },
];
function rehandleClickOp(record) {
  console.log(record);
}

export default function TableSingleSort() {
  const [data] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([1, '2']);

  function onSelectChange(value, { selectedRowData }) {
    console.log(value, selectedRowData);
    setSelectedRowKeys(value);
  }

  return (
    <div className="demo-table-select">
      <Table
        rowKey="id"
        data={data}
        columns={columns}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
      />
    </div>
  );
}
