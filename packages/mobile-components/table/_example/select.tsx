import React, { useState } from 'react';
import { Button, Table, Tag, TdPrimaryTableProps } from 'tdesign-mobile-react';

export default function SelectExample() {
  const [selectRow1, setSelectRow1] = useState<(string | number)[]>([]);
  const [selectRow2, setSelectRow2] = useState<(string | number)[]>([]);
  const data = [];
  const total = 5;
  for (let i = 0; i < total; i++) {
    data.push({
      index: i + 1,
      projName: ['项目名称1', '项目名称2', '项目名称3'][i % 3],
      projTag: ['默认标签', '默认标签', '默认标签'][i % 3],
      options: {
        admin: ['管理', '管理', '管理'][i % 3],
        delete: ['删除', '删除', '删除'][i % 3],
      },
    });
  }

  const globalColumns: TdPrimaryTableProps['columns'] = [
    { colKey: 'projName', title: '项目名称', width: 80 },
    {
      colKey: 'projTag',
      title: '项目名称',
      width: 80,
      cell: ({ row }) => (
        <Tag theme="success" variant="light">
          {row.projTag}
        </Tag>
      ),
    },
    {
      colKey: 'options',
      title: '操作',
      align: 'center',
      className: 'example-table-options',
      cell: ({ col, row }) => (
        <div className="loading-cell-options">
          <Button theme="primary" variant="text" size="small">
            {row[col.colKey].admin}
          </Button>
          <Button theme="primary" variant="text" size="small">
            {row[col.colKey].delete}
          </Button>
        </div>
      ),
    },
  ];

  const singleSelectColumns: TdPrimaryTableProps['columns'] = [
    { colKey: 'projSelect', type: 'single', width: 30, checkProps: { allowUncheck: true } },
    ...globalColumns,
  ];

  const multipleSelectColumns: TdPrimaryTableProps['columns'] = [
    { colKey: 'projSelect', type: 'multiple', width: 30 },
    ...globalColumns,
  ];

  const handleSelectChange = (tableIndex: number, selectKeys: (number | string)[]) => {
    console.log('row-select=====', selectKeys);
    if (tableIndex === 1) {
      setSelectRow1(selectKeys);
    } else {
      setSelectRow2(selectKeys);
    }
  };
  return (
    <div className="loading-example-table select-example">
      <div className="loading-example-title">单选</div>
      <Table
        showHeader
        selectOnRowClick
        columns={singleSelectColumns}
        data={data}
        cellEmptyContent={'vvv'}
        rowKey="index"
        selectedRowKeys={selectRow1}
        onSelectChange={(v) => handleSelectChange(1, v)}
      ></Table>
      <div className="loading-example-title">多选</div>
      <Table
        showHeader
        selectOnRowClick
        columns={multipleSelectColumns}
        data={data}
        cellEmptyContent={'vvv'}
        rowKey="index"
        selectedRowKeys={selectRow2}
        onSelectChange={(v) => handleSelectChange(2, v)}
      ></Table>
    </div>
  );
}
