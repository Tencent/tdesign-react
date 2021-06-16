import React from 'react';
import { Table } from '@tencent/tdesign-react';

const exampleList = [
  {
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  },
  {
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  },
  {
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  },
  {
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  },
  {
    projectName: 'TDesign Wonderful',
    manager: ['yacentlin', 'grayqin', 'sheepluo', 'cache'],
    company: 'Tencent',
  },
];

export default function TableExample() {
  return null;

  return (
    <Table
      data={exampleList}
      // height={100}
      // bordered={false}
      // loading={true}
      columns={[
        {
          colKey: 'project',
          title: '项目名称',
          width: '150px',
          render: ({ row }) => row.projectName,
        },
        {
          colKey: 'memeber',
          title: '管理员',
          width: '300px',
          render: ({ row }) => row.manager.join(','),
        },
        {
          colKey: 'company',
          title: '所属公司',
          width: '150px',
          render: ({ row }) => row.company,
        },
      ]}
      rowKey="projectName"
    />
  );
}
