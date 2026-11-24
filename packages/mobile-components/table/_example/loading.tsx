import React from 'react';
import { Button, Table, Tag, TdPrimaryTableProps } from 'tdesign-mobile-react';

export default function LoadingExample() {
  const data = [];
  const total = 9;
  for (let i = 0; i < total; i++) {
    data.push({
      index: i + 1,
      projName: ['项目名称', '项目名称', '项目名称'][i % 3],
      projTag: ['默认标签', '默认标签', '默认标签'][i % 3],
      options: {
        admin: ['管理', '管理', '管理'][i % 3],
        delete: ['删除', '删除', '删除'][i % 3],
      },
    });
  }

  const columns: TdPrimaryTableProps['columns'] = [
    { colKey: 'projName', title: '项目名称', width: 80, ellipsis: true },
    {
      colKey: 'projTag',
      title: '项目名称',
      width: 80,
      cell: ({ row }) => (
        <Tag theme="success" variant="light">
          {row.projTag}
        </Tag>
      ),
    },
    {
      colKey: 'options',
      title: '操作',
      align: 'center',
      className: 'example-table-options',
      cell: ({ col, row }) => (
        <div className="loading-cell-options">
          <Button theme="primary" variant="text" size="small">
            {row[col.colKey].admin}
          </Button>
          <Button theme="primary" variant="text" size="small">
            {row[col.colKey].delete}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="loading-example-table">
      <div className="loading-example-title">上拉加载</div>
      <Table
        columns={columns}
        data={data}
        cellEmptyContent={'vvv'}
        rowKey="index"
        showHeader
        pagination={{ total, defaultPageSize: 5 }}
      ></Table>
      <div className="loading-example-title">分页加载</div>
      <Table
        columns={columns}
        data={data}
        cellEmptyContent={'vvv'}
        rowKey="index"
        showHeader
        loadingMode="pagination"
        pagination={{ total, defaultPageSize: 5 }}
      ></Table>
    </div>
  );
}
