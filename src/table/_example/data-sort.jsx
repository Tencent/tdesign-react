import React, { useState } from 'react';
import { Table, Checkbox, Space, Tag } from 'tdesign-react';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

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
    sorter: (a, b) => a.status - b.status,
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
    title: '申请耗时(天)',
    colKey: 'time',
    width: '140',
    align: 'center',
    sortType: 'all',
    sorter: (a, b) => a.time - b.time,
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
  const [data, setData] = useState(initialData);
  const [sortInfo, setSortInfo] = useState({ sortBy: 'status', descending: true });
  const [multipleSort, setMultipleSort] = useState(false);

  function onSortChange(sort, options) {
    console.log(sort, options);
    setSortInfo(sort);
    // 默认不存在排序时，也可以在这里设置 data 的值
    // setData(options.currentDataSource);
  }

  // 默认存在排序时，必须在这里给 data 赋值
  function onDataChange(newData) {
    setData(newData);
  }

  return (
    <Space direction="vertical">
      <Checkbox style={{ marginBottom: 16 }} value={multipleSort} onChange={setMultipleSort}>
        是否允许多字段排序
      </Checkbox>
      <Table
        rowKey="index"
        data={data}
        columns={columns}
        sort={sortInfo}
        multipleSort={multipleSort}
        onSortChange={onSortChange}
        onDataChange={onDataChange}
      />
    </Space>
  );
}
