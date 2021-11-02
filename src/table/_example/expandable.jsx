import React from 'react';
import { Table } from '@tencent/tdesign-react';
import './expandable.less';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 200, className: 'instance' },
  {
    colKey: 'status',
    title: '状态',
    width: 200,
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
  { colKey: 'owner', title: '管理员', width: 200 },
  { colKey: 'description', title: '描述' },
];
const data = [
  {
    id: 'demo1',
    instance: 'JQTest1',
    status: 0,
    owner: 'jenny;peter',
    description: 'test1',
  },
  {
    id: 'demo2',
    instance: 'JQTest2',
    status: 1,
    owner: 'jenny',
    description: 'test2',
  },
  {
    id: 'test3',
    instance: 'JQTest3',
    status: 0,
    owner: 'jenny',
    description: 'test3',
  },
  {
    id: 'test4',
    instance: 'JQTest4',
    status: 1,
    owner: 'peter',
    description: 'test4',
  },
];

export default function TableExample() {
  // const [expandedRowKeys, setExpandedRowKeys] = useState(['demo2', 'test3']); // 受控方式
  const defaultExpandedRowKeys = ['demo2'];

  const rehandleExpandChange = (expandedRowKeys, { expandedRowData }) => {
    // setExpandedRowKeys([...expandedRowKeys]); // 受控方式
    console.log('value', expandedRowKeys);
    console.log('rehandleExpandChange', expandedRowData);
  };

  return (
    <div className="demo-container">
      <Table
        data={data}
        columns={columns}
        rowKey="id"
        // expandIcon={<IconFont name="add-circle" size="1em" />}
        // expandedRowKeys={expandedRowKeys} // 受控方式
        defaultExpandedRowKeys={defaultExpandedRowKeys}
        // expandOnRowClick={true}
        expandedRow={({ row, index }) => (
          <div className="more-detail">
            <p className="title">
              <b>集群名称:</b>
            </p>
            <p className="content">
              {row.instance}-{index}
            </p>
            <br />
            <p className="title">
              <b>管理员:</b>
            </p>
            <p className="content">
              {row.owner}-{index}
            </p>
            <br />
            <p className="title">
              <b>描述:</b>
            </p>
            <p className="content">
              {row.description}-{index}
            </p>
          </div>
        )}
        onExpandChange={rehandleExpandChange}
      />
    </div>
  );
}
