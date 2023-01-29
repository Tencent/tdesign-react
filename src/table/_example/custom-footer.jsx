import React, { useState } from 'react';
import { Table, Radio, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};
const columns = [
  {
    align: 'left',
    colKey: 'applicant',
    title: '申请人',
    foot: () => <b style={{ fontWeight: 'bold' }}>表尾信息</b>,
    width: '120',
  },
  {
    title: '审批状态',
    colKey: 'status',
    width: '150',
    // 使用 cell 方法自定义单元格：
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
    foot: () => <div style={{ width: '100%' }}>表尾信息 </div>,
  },
  { colKey: 'channel', title: '签署方式', foot: '表尾信息' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true, foot: () => <div>表尾信息</div> },
  {
    colKey: 'createTime',
    title: '申请时间',
    foot: () => <div style={{ textAlign: 'left' }}>表尾信息</div>,
  },
];

const data = [];
for (let i = 0; i < 3; i++) {
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

// 表尾有一行数据
const footData = [
  {
    index: '123',
    type: '全部类型',
    default: '',
    description: '-',
    required: '未知',
  },
];

export default function TableFixHeader() {
  // 自定义表尾方式一：普通表尾
  const [footerType, setFooterType] = useState('normal');

  // 自定义表尾方式二：通栏表尾
  const footerSummary = <div className="t-table__row-filter-inner">通栏总结行信息</div>;

  // 自定义表尾方式三：自定义合并单元格表尾
  const rowspanAndColspanInFooter = ({ rowIndex, colIndex }) => {
    console.log(rowIndex, colIndex);
    // 中间列合并，收尾两列不合并
    if (rowIndex === 0 && colIndex === 1) return { colspan: columns.length - 2 };
    return {};
  };

  return (
    <div className="tdesign-demo-block-column-large tdesign-demo__table">
      <div>
        {/* <!-- 表尾有 3 种方式 --> */}
        <Radio.Group value={footerType} onChange={setFooterType} variant="default-filled">
          <Radio.Button value="normal">普通表尾</Radio.Button>
          <Radio.Button value="full">通栏表尾</Radio.Button>
          <Radio.Button value="custom">自定义表尾合并列</Radio.Button>
        </Radio.Group>
      </div>
      <Table
        bordered
        data={data}
        columns={columns}
        rowKey="index"
        footData={['normal', 'custom'].includes(footerType) ? footData : []}
        footerSummary={footerType === 'full' ? footerSummary : null}
        rowspanAndColspanInFooter={footerType === 'custom' ? rowspanAndColspanInFooter : undefined}
      />
    </div>
  );
}
