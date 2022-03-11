import React, { useState } from 'react';
import { EnhancedTable, Radio } from 'tdesign-react';

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    disabled: ({ row }) => row.instance === 'JQTest2',
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
    children: [
      {
        id: '3-1',
        instance: 'JQTest3-1',
        status: 1,
        owner: 'jenny',
        description: 'test',
        children: [
          {
            id: '3-1-1',
            instance: 'JQTest3-1-1',
            status: 1,
            owner: 'jenny',
            description: 'test',
          },
          {
            id: '3-1-2',
            instance: 'JQTest3-1-2',
            status: 1,
            owner: 'jenny',
            description: 'test',
          },
        ],
      },
      {
        id: '3-2',
        instance: 'JQTest3-2',
        status: 1,
        owner: 'jenny',
        description: 'test',
      },
    ],
  },
  {
    id: 4,
    instance: 'JQTest4',
    status: 1,
    owner: 'peter',
    description: 'test',
  },
  {
    id: 5,
    instance: 'JQTest5',
    status: 1,
    owner: 'peter',
    description: 'test',
    children: [
      {
        id: '5-1',
        instance: 'JQTest5-1',
        status: 1,
        owner: 'jenny',
        description: 'test',
      },
    ],
  },
  {
    id: 6,
    instance: 'JQTest6',
    status: 1,
    owner: 'peter',
    description: 'test',
  },
];

export default function TableSingleSort() {
  const [data] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([1]);
  const [checkStrictly, setCheckStrictly] = useState(true);

  function onSelectChange(value, selectOptions) {
    console.log('onSelectChange', value, selectOptions);
    setSelectedRowKeys(value);
  }

  return (
    <div className="demo-table-tree-select">
      <Radio.Group value={checkStrictly} onChange={setCheckStrictly}>
        <Radio.Button value={true}>父子行选中独立</Radio.Button>
        <Radio.Button value={false}>父子行选中关联</Radio.Button>
      </Radio.Group>

      <EnhancedTable
        rowKey="id"
        data={data}
        columns={columns}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        tree={{ checkStrictly }}
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  );
}
