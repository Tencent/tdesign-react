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

export default function TableFixHeader() {
  return (
    <Table
      records={exampleList}
      height={200}
      bordered={false}
      columns={[
        {
          key: 'project',
          title: '项目名称',
          width: '150px',
          render: (x) => x.projectName,
        },
        {
          key: 'memeber',
          title: '管理员',
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
  );
}
