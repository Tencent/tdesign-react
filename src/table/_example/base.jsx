import React, { useState } from 'react';
import { Table, Checkbox, Radio, Space } from 'tdesign-react';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const data = [];
const total = 28;
for (let i = 0; i < total; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

export default function TableBasic() {
  const [stripe, setStripe] = useState(false);
  const [bordered, setBordered] = useState(false);
  const [hover, setHover] = useState(false);
  const [tableLayout, setTableLayout] = useState(false);
  const [size, setSize] = useState('medium');

  const table = (
    <Table
      data={data}
      resizable
      columns={[
        {
          width: '100',
          colKey: 'index',
          title: '序号',
          // 对齐方式
          align: 'center',
          // 设置列类名
          className: 'custom-column-class-name',
          // 设置列属性
          attrs: {
            'data-id': 'first-column',
          },
        },
        {
          width: 100,
          colKey: 'platform',
          title: '平台',
        },
        {
          colKey: 'type',
          title: '类型',
        },
        {
          colKey: 'default',
          title: '默认值',
        },
        {
          colKey: 'needed',
          title: '是否必传',
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          width: 200,
          /**
           * 1.内容超出时，是否显示省略号。值为 true，则浮层默认显示单元格内容；
           * 2.值类型为 () => ReactNode 则自定义浮层显示内容；
           * 3.值类型为 Object，则自动透传属性到 Popup 组件。
           */
          ellipsis: true,

          // 透传省略内容浮层 Popup 组件全部特性，示例代码有效，勿删！！！
          // ellipsis: { placement: 'bottom', destroyOnClose: false },

          // 完全自定义 ellipsis 浮层的样式和内容，示例代码有效，勿删！！！
          // ellipsis: ({ row, col, rowIndex, colIndex }) => (
          //   <div>自定义浮层内容：ID({row.index})；第 {rowIndex + 1} 行；第 {colIndex} 列；列标识：{col.colKey}</div>
          // ),
        },
      ]}
      rowKey="index"
      verticalAlign="top"
      size={size}
      bordered={bordered}
      hover={hover}
      stripe={stripe}
      tableLayout={tableLayout ? 'auto' : 'fixed'}
      rowClassName={({ rowIndex }) => `${rowIndex}-class`}
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
      <div>
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
      </div>

      {table}
    </Space>
  );
}
