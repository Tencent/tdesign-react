import React from 'react';
import { Table, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, UserIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const data = [];
const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

for (let i = 0; i < 5; i++) {
  data.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const columns = [
  {
    colKey: 'applicant',
    width: 120,
    title: () => (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <UserIcon style={{ marginRight: 5 }}></UserIcon>申请人
      </span>
    ),
  },
  {
    title: '审批状态',
    // 没有 cell 的情况下， platform 会被用作自定义单元格的插槽名称
    colKey: 'status',
    width: 120,
    cell: ({ row }) => (
      <Tag
        shape="round"
        theme={statusNameListMap[row.status].theme}
        variant="light-outline"
        icon={statusNameListMap[row.status].icon}
      >
        {statusNameListMap[row.status].label}
      </Tag>
    ),
  },
  {
    colKey: 'matters',
    title: '申请事项',
    // 使用 cell 方法自定义单元格：
    cell: ({ col, row }) => <div>{row[col.colKey]}</div>,
  },
  {
    title: '邮箱地址',
    colKey: 'email',
    // render 即可渲染表头，也可以渲染单元格。但 cell 只能渲染单元格，title 只能渲染表头
    render(context) {
      const { type, row, col } = context;
      if (type === 'title') return '邮箱地址';
      return <div>{row[col.colKey]}</div>;
    },
  },
  { colKey: 'createTime', title: '申请时间' },
];

export default function TableFixHeader() {
  return <Table bordered data={data} columns={columns} rowKey="property" />;
}
