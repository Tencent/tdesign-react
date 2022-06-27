import React, { useState, useEffect } from 'react';
import { Table, Radio, Checkbox, Space } from 'tdesign-react';
import { ChevronRightCircleIcon, ChevronRightIcon } from 'tdesign-icons-react';

export default function TableExpandable() {
  const getColumns = (isFixedColumn) => [
    { colKey: 'instance', title: '集群名称', fixed: isFixedColumn ? 'left' : '' },
    {
      colKey: 'status',
      title: '状态',
      cell: ({ row }) => (row.status === 0 ? '异常' : '健康'),
    },
    { colKey: 'owner', title: '管理员' },
    { colKey: 'description', title: '描述' },
    { colKey: 'field1', title: '字段 1' },
    { colKey: 'field2', title: '字段 2' },
    { colKey: 'field3', title: '字段 3' },
    { colKey: 'field4', title: '字段 4' },
    { colKey: 'field5', title: '字段 5' },
    { colKey: 'field6', title: '字段 6' },
    {
      colKey: 'op',
      title: '操作',
      cell: () => <span>管理</span>,
      fixed: isFixedColumn ? 'right' : '',
    },
  ];

  const initialData = new Array(5).fill(null).map((item, index) => ({
    id: index + 100,
    instance: `JQTest${index + 1}`,
    status: index % 2,
    owner: 'jenny;peter',
    description: 'description',
    field1: 'field1',
    field2: 'field2',
    field3: 'field3',
    field4: 'field4',
    field5: 'field5',
    field6: 'field6',
  }));

  const [data] = useState(initialData);
  const [expandControl, setExpandControl] = useState('true');
  const [expandIcon, setExpandIcon] = useState(true);
  const [expandOnRowClick, setExpandOnRowClick] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState(['2']);
  const [fixedColumns, setFixedColumns] = useState(false);
  const [emptyData, setEmptyData] = useState(false);

  const columns = getColumns(fixedColumns);

  const expandedRow = ({ row }) => (
    <div className="more-detail">
      <p className="title">
        <b>集群名称:</b>
      </p>
      <p className="content">{row.instance}</p>
      <br />
      <p className="title">
        <b>管理员:</b>
      </p>
      <p className="content">{row.owner}</p>
      <br />
      <p className="title">
        <b>描述:</b>
      </p>
      <p className="content">{row.description}</p>
    </div>
  );

  const rehandleExpandChange = (value, { expandedRowData }) => {
    setExpandedRowKeys(value);
    console.log('rehandleExpandChange', value, expandedRowData);
  };

  // 完全自由控制表格的每一行是否显示展开图标，以及显示什么内容
  const tmpExpandIcon = ({ row, index }) => {
    // 第一行不显示展开图标
    if (index === 0) return false;
    // 第三行，使用自定义展开图标
    if (row?.id === 103) return <ChevronRightIcon />;
    // 其他行，使用表格同款展开图标
    return <ChevronRightCircleIcon />;
  };

  useEffect(() => {
    const val = expandControl;
    if (val === 'true') {
      // expandIcon 默认为 true，表示显示默认展开图标
      setExpandIcon(true);
    } else if (val === 'false') {
      // expandIcon 值为 false，则表示隐藏全部展开图标
      setExpandIcon(false);
    } else if (val === 'custom') {
      setExpandIcon(val);
    }
  }, [expandControl]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* <!-- expanded-row-keys 为受控属性 --> */}
      {/* <!-- default-expanded-row-keys 为非受控属性 --> */}
      <div>
        <Radio.Group value={expandControl} onChange={setExpandControl} variant="default-filled">
          <Radio.Button value="true"> 显示展开图标 </Radio.Button>
          <Radio.Button value="false"> 隐藏展开图标 </Radio.Button>
          <Radio.Button value="custom"> 自由控制展开图标 </Radio.Button>
        </Radio.Group>
      </div>

      <div>
        <Checkbox checked={expandOnRowClick} onChange={setExpandOnRowClick}>
          允许点击行之后展开/收起
        </Checkbox>
        <Checkbox checked={fixedColumns} onChange={setFixedColumns} style={{ marginLeft: '32px' }}>
          固定列
        </Checkbox>
        <Checkbox checked={emptyData} onChange={setEmptyData} style={{ marginLeft: '32px' }}>
          空数据
        </Checkbox>
      </div>

      {/* <!-- :defaultExpandedRowKeys="defaultExpandedRowKeys" --> */}
      <Table
        rowKey="id"
        columns={columns}
        data={emptyData ? [] : data}
        expandedRowKeys={expandedRowKeys}
        expandedRow={expandedRow}
        expandOnRowClick={expandOnRowClick}
        expandIcon={expandIcon === 'custom' ? tmpExpandIcon : expandIcon}
        tableLayout="auto"
        tableContentWidth="1200"
        onExpandChange={rehandleExpandChange}
      ></Table>
    </Space>
  );
}
