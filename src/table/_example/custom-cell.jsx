import React from 'react';
import { Table, ViewModuleIcon, AttachIcon } from '@tencent/tdesign-react';

const data = Array(5)
  .fill(1)
  .map((_, i) => ({
    index: i,
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  }));

export default function TableFixHeader() {
  return (
    <Table
      bordered
      data={data}
      columns={[
        {
          colKey: 'project',
          width: '150px',
          render: ({ row }) => row.projectName,
          title: (
            <span>
              <ViewModuleIcon></ViewModuleIcon>类型
            </span>
          ),
        },
        {
          colKey: 'member',
          title: '管理员',
          width: '300px',
          render: () => (
            <span>
              <AttachIcon></AttachIcon>
              <a href="#">公有</a>
            </span>
          ),
        },
        {
          colKey: 'company',
          title: '所属公司',
          width: '150px',
          render: ({ row }) => row.company,
        },
      ]}
      rowKey="index"
    />
  );
}
