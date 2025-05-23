import React, { useState } from 'react';
import { Table, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

import type { TableProps } from 'tdesign-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};
const columns: TableProps['columns'] = [
  {
    colKey: 'row-select',
    type: 'multiple',
    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
    // 这种方式禁用行选中，行文本不会变灰
    checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0, title: rowIndex % 2 !== 0 ? '不可选' : null }),
    width: 50,
  },
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
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
  { colKey: 'channel', title: '签署方式', width: '120' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' },
];
const initData: TableProps['data'] = [];
for (let i = 0; i < 5; i++) {
  initData.push({
    index: i + 100,
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
  const [data] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange: TableProps['onSelectChange'] = (value, { selectedRowData }) => {
    console.log(value, selectedRowData);
    setSelectedRowKeys(value);
  };

  return (
    <Table
      rowKey="index"
      data={data}
      columns={columns}
      selectOnRowClick={true}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
      lazyLoad
    />
  );
}
