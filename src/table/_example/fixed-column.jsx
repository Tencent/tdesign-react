import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space, Tag, Link } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
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

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

export default function TableFixedColumn() {
  const [tableLayout, setTableLayout] = useState('fixed');
  const [emptyData, setEmptyData] = useState(false);
  const [leftFixedColumn, setLeftFixedColumn] = useState(2);
  const [rightFixedColumn, setReftFixedColumn] = useState(1);

  const table = (
    <Table
      bordered
      rowKey="index"
      data={emptyData ? [] : data}
      tableLayout={tableLayout}
      tableContentWidth={tableLayout === 'fixed' ? undefined : '1200px'}
      resizable={true}
      columns={[
        { colKey: 'applicant', title: '申请人', width: 100, fixed: 'left' },
        {
          colKey: 'status',
          title: '审批状态',
          width: 150,
          fixed: leftFixedColumn >= 2 ? 'left' : undefined,
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
        { colKey: 'detail.email', title: '邮箱地址', width: 180 },
        { colKey: 'matters', title: '申请事项', width: 200 },
        { colKey: 'createTime', title: '申请日期', width: 120, fixed: rightFixedColumn >= 2 ? 'right' : undefined },
        {
          colKey: 'operation',
          title: '操作',
          width: 100,
          fixed: 'right',
          cell: ({ row }) => (
            <Link theme="primary" hover="color">
              {row.status === 0 ? '查看详情' : '再次申请'}
            </Link>
          ),
        },
      ]}
    />
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={leftFixedColumn} variant="default-filled" onChange={setLeftFixedColumn}>
        <Radio.Button value={1}>左侧固定一列</Radio.Button>
        <Radio.Button value={2}>左侧固定两列</Radio.Button>
      </Radio.Group>

      <Radio.Group value={rightFixedColumn} variant="default-filled" onChange={setReftFixedColumn}>
        <Radio.Button value={1}>右侧固定一列</Radio.Button>
        <Radio.Button value={2}>右侧固定两列</Radio.Button>
      </Radio.Group>

      <div>
        <Radio.Group value={tableLayout} variant="default-filled" onChange={setTableLayout}>
          <Radio.Button value="fixed">table-layout: fixed</Radio.Button>
          <Radio.Button value="auto">table-layout: auto</Radio.Button>
        </Radio.Group>
        <Checkbox value={emptyData} onChange={setEmptyData} style={{ marginLeft: '16px', verticalAlign: 'middle' }}>
          空数据
        </Checkbox>
      </div>

      {table}
    </Space>
  );
}
