import React, { useState } from 'react';
import { Table, Checkbox, Space } from 'tdesign-react';

const initialData = [];
for (let i = 0; i < 20; i++) {
  initialData.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    property: ['A', 'B', 'C'][i % 3],
    default: i,
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    type_default: '-',
    description: '数据源',
    field1: '字段1',
    field2: '字段2',
    field3: '字段3',
    field4: '字段4',
    field5: '字段5',
    field6: '字段6',
    field7: '字段7',
    field8: '字段8',
    text: '这是一段很长很长很长的文本',
  });
}

export default function TableExample() {
  const [data, setData] = useState([...initialData]);
  const [bordered, setBordered] = useState(true);
  const [fixedHeader, setFixedHeader] = useState(true);
  const [fixedLeftCol, setFixedLeftCol] = useState(false);
  const [fixedRightCol, setFixedRightCol] = useState(false);
  const [headerAffixedTop, setHeaderAffixedTop] = useState(false);
  const [sort, setSort] = useState({ sortBy: 'default', descending: false });

  const onSortChange = (sortInfo, context) => {
    setSort(sortInfo);
    setData([...context.currentDataSource]);
    console.log(context);
  };

  const columns = [
    {
      title: '序号',
      colKey: 'index',
      fixed: fixedLeftCol && 'left',
      width: 100,
    },
    {
      title: '汇总属性',
      fixed: fixedLeftCol && 'left',
      width: 100,
      colKey: 'total_info',
      children: [
        {
          align: 'left',
          colKey: 'platform',
          title: '平台',
          fixed: fixedLeftCol && 'left',
          width: 100,
        },
        {
          title: '类型及默认值',
          colKey: 'type_default',
          fixed: fixedLeftCol && 'left',
          width: 100,
          children: [
            {
              align: 'left',
              colKey: 'type',
              title: '类型',
              fixed: fixedLeftCol && 'left',
              width: 110,
            },
            {
              align: 'left',
              colKey: 'default',
              title: '默认值',
              fixed: fixedLeftCol && 'left',
              width: 100,
              sorter: (a, b) => a.default - b.default,
            },
            {
              align: 'left',
              colKey: 'needed',
              title: '是否必传',
              fixed: fixedLeftCol && 'left',
              width: 100,
            },
          ],
        },
      ],
    },
    {
      colKey: 'field1',
      title: '字段1',
      width: 100,
    },
    {
      colKey: 'field2',
      title: '字段2',
      width: 100,
    },

    {
      colKey: 'field3',
      title: '字段3',
      width: 100,
    },
    {
      colKey: 'field4',
      title: '字段4',
      width: 100,
    },
    {
      title: '属性及说明',
      colKey: 'instruction',
      fixed: fixedRightCol && 'right',
      width: 100,
      children: [
        {
          align: 'left',
          ellipsis: true,
          colKey: 'property',
          title: '属性',
          fixed: fixedRightCol && 'right',
          width: 100,
          filter: {
            type: 'single',
            list: [
              { label: 'any', value: '' },
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'D', value: 'D' },
            ],
          },
        },
        {
          align: 'left',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
          fixed: fixedRightCol && 'right',
          width: 100,
          children: [
            {
              colKey: 'field6',
              title: '字段6',
              fixed: fixedRightCol && 'right',
              width: 100,
            },
            {
              colKey: 'field7',
              title: '字段7',
              fixed: fixedRightCol && 'right',
              width: 100,
            },
            {
              colKey: 'text',
              title: '描述',
              fixed: fixedRightCol && 'right',
              ellipsis: true,
              width: 100,
            },
          ],
        },
      ],
    },
    {
      colKey: 'field5',
      title: '字段5',
      fixed: fixedRightCol && 'right',
      width: 100,
    },
  ];
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* <!-- 按钮操作区域 --> */}
      <div>
        <Checkbox checked={bordered} onChange={setBordered}>
          显示表格边框
        </Checkbox>
        <Checkbox checked={fixedHeader} onChange={setFixedHeader}>
          显示固定表头
        </Checkbox>
        <Checkbox checked={fixedLeftCol} onChange={setFixedLeftCol}>
          固定左侧列
        </Checkbox>
        <Checkbox checked={fixedRightCol} onChange={setFixedRightCol}>
          固定右侧列
        </Checkbox>
        <Checkbox checked={headerAffixedTop} onChange={setHeaderAffixedTop}>
          表头吸顶
        </Checkbox>
      </div>

      <Table
        data={data}
        bordered={bordered}
        columns={columns}
        rowKey="index"
        maxHeight={fixedHeader ? 380 : undefined}
        headerAffixProps={{ offsetTop: 0 }}
        headerAffixedTop={headerAffixedTop}
        columnController={{ displayType: 'auto-width' }}
        sort={sort}
        onSortChange={onSortChange}
      />
    </Space>
  );
}
