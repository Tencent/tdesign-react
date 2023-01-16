import React, { useState } from 'react';
import { Table, Space, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};
const columns = [
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
    sortType: 'all',
    sorter: true,
    cell: ({ rowIndex }) => {
      const status = rowIndex % 3;
      return (
        <Tag
          shape="round"
          theme={statusNameListMap[status].theme}
          variant="light-outline"
          icon={statusNameListMap[status].icon}
        >
          {statusNameListMap[status].label}
        </Tag>
      );
    },
  },
  {
    colKey: 'time',
    title: '申请耗时(天)',
    align: 'center',
    width: '140',
    sortType: 'all',
    sorter: true,
  },
  { colKey: 'channel', title: '签署方式', width: '120' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' },
];

const initialData = [];
for (let i = 0; i < 5; i++) {
  initialData.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

export default function TableSingleSort() {
  const [sort, setSort] = useState([
    {
      sortBy: 'status',
      descending: true,
    },
    {
      sortBy: 'survivalTime',
      descending: false,
    },
  ]);

  function onSortChange(sort) {
    setSort(sort);
    // Request: 发起远程请求进行排序
    console.log('发起远程请求进行排序（未模拟请求数据）');
  }

  return (
    <Space direction="vertical">
      <div>排序方式：{JSON.stringify(sort)}</div>
      <Table rowKey="index" data={initialData} columns={columns} sort={sort} multipleSort onSortChange={onSortChange} />
    </Space>
  );
}
