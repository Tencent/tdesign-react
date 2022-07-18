import React, { useState } from 'react';
import { Table, Button } from 'tdesign-react';

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',

    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删，随时需要测试）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删，随时需要测试）
    // 这种方式禁用行选中，行文本不会变灰，不会添加类名 t-table__row--disabled
    checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0 }),

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
    align: 'center',
    cell() {
      return (
        <>
          <Button variant="text">管理</Button>
          <Button variant="text">删除</Button>
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

export default function TableSingleSort() {
  const [data] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([1]);

  function onSelectChange(value, { selectedRowData }) {
    console.log(value, selectedRowData);
    setSelectedRowKeys(value);
  }

  return (
    <Table
      rowKey="id"
      data={data}
      columns={columns}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
    />
  );
}
