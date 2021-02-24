import React from 'react';
import { Table } from '@tencent/tdesign-react';

export default function EmptyTable() {
  const TableData = [];
  return (
    <div>
      <div>使用默认空表格样式</div>
      <Table
        records={TableData}
        columns={[
          {
            key: 'project',
            title: '项目名称',
            fixed: 'left',
            width: '150px',
            render: (x) => x.projectName,
          },
          {
            key: 'memeber',
            title: '管理员',
            fixed: 'right',
            width: '300px',
            render: (x) => x.manager.join(','),
          },
          {
            key: 'company',
            title: '所属公司',
            width: '150px',
            render: (x) => x.company,
          },
        ]}
        rowKey="projectName"
      />
      <div style={{ marginTop: 10 }}>自定义空表格</div>
      <Table
        records={TableData}
        empty={
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100 }}>
            😄 It's empty.
          </span>
        }
        columns={[
          {
            key: 'project',
            title: '项目名称',
            fixed: 'left',
            width: '150px',
            render: (x) => x.projectName,
          },
          {
            key: 'memeber',
            title: '管理员',
            fixed: 'right',
            width: '300px',
            render: (x) => x.manager.join(','),
          },
          {
            key: 'company',
            title: '所属公司',
            width: '150px',
            render: (x) => x.company,
          },
        ]}
        rowKey="projectName"
      />
    </div>
  );
}
