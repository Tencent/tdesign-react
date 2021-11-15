import React from 'react';
import { Table } from 'tdesign-react';

export default function EmptyTable() {
  const TableData = [];
  return (
    <div>
      <div>使用默认空表格样式</div>
      <Table
        data={TableData}
        columns={[
          {
            colKey: 'project',
            title: '项目名称',
            width: '150px',
            cell: ({ row }) => row.projectName,
          },
          {
            colKey: 'memeber',
            title: '管理员',
            width: '300px',
            cell: ({ row }) => row.manager.join(','),
          },
          {
            colKey: 'company',
            title: '所属公司',
            width: '150px',
            cell: ({ row }) => row.company,
          },
        ]}
        rowKey="projectName"
      />
      <div style={{ marginTop: 10 }}>自定义空表格</div>
      <Table
        data={TableData}
        empty={
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            😄 it is empty.
          </span>
        }
        columns={[
          {
            colKey: 'project',
            title: '项目名称',
            width: '150px',
            cell: ({ row }) => row.projectName,
          },
          {
            colKey: 'memeber',
            title: '管理员',
            width: '300px',
            cell: ({ row }) => row.manager.join(','),
          },
          {
            colKey: 'company',
            title: '所属公司',
            width: '150px',
            cell: ({ row }) => row.company,
          },
        ]}
        rowKey="projectName"
      />
    </div>
  );
}
