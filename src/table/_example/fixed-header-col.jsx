import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space, Tag, Link } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const data = [];

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
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

export default function TableFixedColumn() {
  const [tableLayout, setTableLayout] = useState('auto');
  const [fixedTopAndBottomRows, setFixedTopAndBottomRows] = useState(false);
  // <!-- 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。需同时设置 table-content-width -->
  // <!-- fixedRows: [2, 2] 表示冻结表格的头两行和尾两行 -->
  // <!-- footData 可以是多行，均支持固定在底部 -->
  const table = (
    <Table
      bordered
      data={data}
      footData={[{}]}
      tableLayout={tableLayout}
      tableContentWidth={tableLayout === 'fixed' ? undefined : '1600px'}
      maxHeight={fixedTopAndBottomRows ? 500 : 300}
      fixedRows={fixedTopAndBottomRows ? [2, 2] : undefined}
      columns={[
        { colKey: 'applicant', title: '申请人', width: '100', foot: '共20条', fixed: 'left' },
        {
          colKey: 'status',
          title: '审批状态',
          width: '150',
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
        { colKey: 'channel', title: '签署方式' },
        { colKey: 'matters', title: '申请事项', width: '150', foot: '-' },
        { colKey: 'detail.email', title: '邮箱地址' },
        { colKey: 'createTime', title: '申请日期', width: '120', foot: '-' },
        {
          colKey: 'operation',
          title: '操作',
          width: '150',
          foot: '-',
          fixed: 'right',
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
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
