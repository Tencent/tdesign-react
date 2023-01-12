import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space, Tag, Link } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const data = [];
for (let i = 0; i < 20; i++) {
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

export default function TableFixHeader() {
  const [tableLayout, setTableLayout] = useState('fixed');
  const [fixedTopAndBottomRows, setFixedTopAndBottomRows] = useState(false);
  // 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。如果列字段过多超出表格宽度，还需同时设置 table-content-width
  // fixedRows: [2, 2] 表示冻结表格的头两行和尾两行
  // footData 可以是多行，均支持固定在底部，用法同 data
  const table = (
    <Table
      data={data}
      footData={[{}]}
      tableLayout={tableLayout}
      maxHeight={fixedTopAndBottomRows ? 500 : 300}
      fixedRows={fixedTopAndBottomRows ? [2, 2] : undefined}
      bordered
      columns={[
        { colKey: 'applicant', title: '申请人', width: 100, foot: '-' },
        {
          colKey: 'status',
          title: '审批状态',
          width: 120,
          foot: '-',
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
        { colKey: 'matters', title: '申请事项', width: 150, foot: '-' },
        { colKey: 'detail.email', title: '邮箱地址', width: 160, foot: '-', ellipsis: true },
        { colKey: 'createTime', title: '申请日期', width: 120, foot: '-' },
        {
          colKey: 'operation',
          title: '操作',
          width: 120,
          foot: '-',
          cell: ({ row }) => (
            <Link theme="primary" hover="color">
              {row.status === 0 ? '查看详情' : '再次申请'}
            </Link>
          ),
        },
      ]}
      rowKey="index"
    />
  );

  return (
    <Space direction="vertical" size="large">
      <RadioGroup value={tableLayout} variant="default-filled" onChange={setTableLayout}>
        <RadioButton value="fixed">table-layout: fixed</RadioButton>
        <RadioButton value="auto">table-layout: auto</RadioButton>
      </RadioGroup>
      <Checkbox value={fixedTopAndBottomRows} onChange={setFixedTopAndBottomRows}>
        是否冻结首尾两行
      </Checkbox>

      {table}
    </Space>
  );
}
