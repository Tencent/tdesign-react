import React, { useState } from 'react';
import { Table, Radio } from 'tdesign-react';

const columns = [
  {
    align: 'center',
    width: '100',
    className: 'row',
    colKey: 'index',
    title: '序号',
    foot: () => <b style={{ color: 'rgb(0, 82, 217)' }}>表尾</b>,
  },
  {
    width: 100,
    colKey: 'platform',
    title: '平台',
    foot: ({ rowIndex }) => (
      <div style={{ width: '100%', textAlign: 'center' }}>第 {rowIndex + 1} 行</div>
    ),
  },
  {
    colKey: 'type',
    title: '类型',
  },
  {
    colKey: 'default',
    title: '默认值',
    foot: ({ row }) => <span>{row.default || '空'}</span>,
  },
  {
    colKey: 'required',
    title: '是否必传',
    width: 150,
  },
  {
    colKey: 'detail.position',
    title: '详情信息',
    width: 200,
    ellipsis: true,
    foot: () => <div>渲染函数输出表尾信息</div>,
  },
];

const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    required: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

// 表尾有一行数据
const footData = [
  {
    index: '123',
    type: '全部类型',
    default: '',
    description: '-',
    requied: '未知',
  },
];

export default function TableFixHeader() {
  // 自定义表尾方式一：普通表尾
  const [footerType, setFooterType] = useState('normal');

  // 自定义表尾方式二：通栏表尾
  const footerSummary = <div className="t-table__row-filter-inner">通栏总结行信息</div>;

  // 自定义表尾方式三：自定义合并单元格表尾
  const rowspanAndColspanInFooter = ({ rowIndex, colIndex }) => {
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
