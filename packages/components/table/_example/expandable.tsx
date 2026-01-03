import React, { useState } from 'react';
import {
  CheckCircleFilledIcon,
  ChevronRightCircleIcon,
  ChevronRightIcon,
  CloseCircleFilledIcon,
  ErrorCircleFilledIcon,
  MoveIcon,
} from 'tdesign-icons-react';
import { Checkbox, Link, Radio, Space, Table, Tag } from 'tdesign-react';
import type { TableProps } from 'tdesign-react';

type ExpandType = 'custom' | boolean;

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

export default function TableExpandable() {
  const getColumns = (dragSort: boolean, isFixedColumn: boolean): TableProps['columns'] => [
    ...(dragSort
      ? [
          {
            colKey: 'drag',
            title: '排序',
            width: 50,
            cell: () => (
              <span>
                <MoveIcon />
              </span>
            ),
          },
        ]
      : []),
    { colKey: 'applicant', title: '申请人', width: '80', ...(isFixedColumn && { fixed: 'left' }) },
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
    {
      colKey: 'operation',
      title: '操作',
      ...(isFixedColumn && { fixed: 'right' }),
      cell: ({ row }) => (
        <Link theme="primary" hover="color">
          {row.status === 0 ? '查看详情' : '再次申请'}
        </Link>
      ),
    },
  ];

  const initialData = new Array(5).fill(null).map((_, i) => ({
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
  }));

  const [data, setData] = useState<any>(initialData);
  const [expandIcon, setExpandIcon] = useState<ExpandType>(true);
  const [expandOnRowClick, setExpandOnRowClick] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState(['2']);
  const [fixedColumns, setFixedColumns] = useState(false);
  const [emptyData, setEmptyData] = useState(false);
  const [dragSort, setDragSort] = useState(true);

  const columns = getColumns(dragSort, fixedColumns);

  const expandedRow: TableProps['expandedRow'] = ({ row }) => (
    <div>
      <p>
        <b>申请人:</b> <span>{row.applicant}</span>
      </p>
      <p>
        <b>邮箱地址:</b> <span>{row.detail.email}</span>
      </p>
      <p>
        <b>签署方式:</b> <span>{row.channel}</span>
      </p>
    </div>
  );

  const handleExpandChange: TableProps['onExpandChange'] = (value, params) => {
    setExpandedRowKeys(value as string[]);
    console.log('rehandleExpandChange', value, params);
  };

  const handleExpandIcon: TableProps['expandIcon'] = ({ index }) => {
    // 第一行不显示展开图标
    if (index === 0) return false;
    // 第三行，使用自定义展开图标
    if (index === 3) return <ChevronRightIcon />;
    // 其他行，使用表格同款展开图标
    return <ChevronRightCircleIcon />;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Radio.Group value={expandIcon} onChange={(val) => setExpandIcon(val as ExpandType)} variant="default-filled">
          <Radio.Button value={true}>显示展开图标</Radio.Button>
          <Radio.Button value={false}>隐藏展开图标</Radio.Button>
          <Radio.Button value="custom">自由控制展开图标</Radio.Button>
        </Radio.Group>
      </Space>

      <Space>
        <Checkbox checked={dragSort} onChange={setDragSort}>
          启用拖拽排序
        </Checkbox>
        <Checkbox checked={expandOnRowClick} onChange={setExpandOnRowClick}>
          允许点击行之后展开/收起
        </Checkbox>
        <Checkbox checked={fixedColumns} onChange={setFixedColumns} style={{ marginLeft: '32px' }}>
          固定列
        </Checkbox>
        <Checkbox checked={emptyData} onChange={setEmptyData} style={{ marginLeft: '32px' }}>
          空数据
        </Checkbox>
      </Space>

      <Table
        bordered
        rowKey="index"
        tableContentWidth="1200"
        lazyLoad
        resizable
        columns={columns}
        data={emptyData ? [] : data}
        expandedRowKeys={expandedRowKeys}
        expandedRow={expandedRow}
        expandOnRowClick={expandOnRowClick}
        expandIcon={typeof expandIcon === 'boolean' ? handleExpandIcon : expandIcon}
        onExpandChange={handleExpandChange}
        {...(dragSort && { dragSort: 'row-handler' })}
        onDragSort={({ newData }) => setData(newData)}
      ></Table>
    </Space>
  );
}
