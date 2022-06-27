import React, { useState } from 'react';
import { Table, Button, Space } from 'tdesign-react';

export default function TableCustomCol() {
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

  const [columnControllerVisible, setColumnControllerVisible] = useState(false);

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

  return (
    <Space direction="vertical" size="large">
      <Button onClick={() => setColumnControllerVisible(true)}>显示列配置弹窗</Button>
      <Table
        displayColumns={displayColumns}
        onDisplayColumnsChange={setDisplayColumns}
        columnControllerVisible={columnControllerVisible}
        onColumnControllerVisibleChange={setColumnControllerVisible}
        rowKey="index"
        data={data}
        columns={columns}
        columnController={{
          fields: ['platform', 'type', 'default'],
          dialogProps: { preventScrollThrough: true },
          hideTriggerButton: true,
        }}
        pagination={{ defaultPageSize: 5, defaultCurrent: 1, total: 100 }}
        tableLayout="auto"
        stripe
        onColumnChange={onColumnChange}
      ></Table>
    </Space>
  );
}
