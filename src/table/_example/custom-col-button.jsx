import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space } from 'tdesign-react';

export default function TableCustomColButton() {
  const [placement, setPlacement] = useState('top-right');
  const [bordered, setBordered] = useState(true);
  const [customText, setCustomText] = useState(false);

  const initialData = [];
  for (let i = 0; i < 100; i++) {
    initialData.push({
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

  const [data] = useState([...initialData]);

  const staticColumn = ['index', 'needed', 'detail.position'];
  const [displayColumns, setDisplayColumns] = useState(staticColumn.concat(['platform', 'type', 'default']));

  const columns = [
    {
      align: 'center',
      className: 'row',
      colKey: 'index',
      title: '序号',
    },
    {
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
      ellipsis: true,
    },
  ];

  const onColumnChange = (params) => {
    console.log(params);
  };

  const tableNode = (
    <Table
      // defaultDisplayColumns={displayColumns}
      displayColumns={displayColumns}
      onDisplayColumnsChange={setDisplayColumns}
      rowKey="index"
      data={data}
      columns={columns}
      columnController={{
        placement,
        fields: ['platform', 'type', 'default'],
        dialogProps: { preventScrollThrough: true },
        buttonProps: customText ? { content: '显示列控制', theme: 'primary', variant: 'base' } : undefined,
      }}
      pagination={{ defaultPageSize: 5, defaultCurrent: 1, total: 100 }}
      bordered={bordered}
      tableLayout="auto"
      stripe
      onColumnChange={onColumnChange}
    ></Table>
  );

  return (
    <Space direction="vertical" size="large">
      <Radio.Group value={placement} onChange={setPlacement} variant="default-filled">
        <Radio.Button value="top-left">左上角</Radio.Button>
        <Radio.Button value="top-right">右上角</Radio.Button>
        <Radio.Button value="bottom-left">左下角</Radio.Button>
        <Radio.Button value="bottom-right">右下角</Radio.Button>
      </Radio.Group>
      <div>
        <Checkbox checked={bordered} onChange={setBordered}>
          是否显示边框
        </Checkbox>
        <Checkbox checked={customText} onChange={setCustomText}>
          自定义列配置按钮
        </Checkbox>
      </div>

      {tableNode}
    </Space>
  );
}
