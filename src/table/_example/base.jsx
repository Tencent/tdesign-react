import React, { useState } from 'react';
import { Table, Checkbox, Radio, Space, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const data = [];
const total = 28;
for (let i = 0; i < total; i++) {
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

export default function TableBasic() {
  const [stripe, setStripe] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [hover, setHover] = useState(false);
  const [tableLayout, setTableLayout] = useState(false);
  const [size, setSize] = useState('medium');
  const [showHeader, setShowHeader] = useState(true);

  // <!-- 当数据为空需要占位时，会显示 cellEmptyContent -->
  const table = (
    <Table
      data={data}
      columns={[
        { colKey: 'applicant', title: '申请人', width: '100' },
        {
          colKey: 'status',
          title: '申请状态',
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
        { colKey: 'channel', title: '签署方式' },
        { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
        { colKey: 'createTime', title: '申请时间' },
      ]}
      rowKey="index"
      verticalAlign="top"
      size={size}
      bordered={bordered}
      hover={hover}
      stripe={stripe}
      showHeader={showHeader}
      tableLayout={tableLayout ? 'auto' : 'fixed'}
      rowClassName={({ rowIndex }) => `${rowIndex}-class`}
      cellEmptyContent={'-'}
      resizable
      bordered
      // 与pagination对齐
      pagination={{
        defaultCurrent: 2,
        defaultPageSize: 5,
        total,
        showJumper: true,
        onChange(pageInfo) {
          console.log(pageInfo, 'onChange pageInfo');
        },
        onCurrentChange(current, pageInfo) {
          console.log(current, pageInfo, 'onCurrentChange current');
        },
        onPageSizeChange(size, pageInfo) {
          console.log(size, pageInfo, 'onPageSizeChange size');
        },
      }}
      onPageChange={(pageInfo) => {
        console.log(pageInfo, 'onPageChange');
      }}
      onRowClick={({ row, index, e }) => {
        console.log('onRowClick', { row, index, e });
      }}
    />
  );

  return (
    <Space direction="vertical">
      <RadioGroup value={size} variant="default-filled" onChange={setSize}>
        <RadioButton value="small">小尺寸</RadioButton>
        <RadioButton value="medium">中尺寸</RadioButton>
        <RadioButton value="large">大尺寸</RadioButton>
      </RadioGroup>
      <Space>
        <Checkbox value={stripe} onChange={setStripe}>
          显示斑马纹
        </Checkbox>
        <Checkbox value={bordered} onChange={setBordered}>
          显示表格边框
        </Checkbox>
        <Checkbox value={hover} onChange={setHover}>
          显示悬浮效果
        </Checkbox>
        <Checkbox value={tableLayout} onChange={setTableLayout}>
          宽度自适应
        </Checkbox>
        <Checkbox value={showHeader} onChange={setShowHeader}>
          显示表头
        </Checkbox>
      </Space>

      {table}
    </Space>
  );
}
