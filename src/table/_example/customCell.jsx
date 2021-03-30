import React from 'react';
import { Table, ViewModuleIcon, AttachIcon } from '@tencent/tdesign-react';

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
          fixed: 'left',
          width: '150px',
          render: (x) => x.projectName,
          title: (
            <span>
              <ViewModuleIcon></ViewModuleIcon>类型
            </span>
          ),
        },
        {
          key: 'memeber',
          title: '管理员',
          fixed: 'right',
          width: '300px',
          render: (x) => (
            <span>
              <AttachIcon></AttachIcon>
              <a href="#">公有</a>
            </span>
          ),
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
