import React, { useState, useEffect } from 'react';
import { Table, Radio, Checkbox, Space, Tag, Link } from 'tdesign-react';
import {
  ChevronRightCircleIcon,
  ChevronRightIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  CloseCircleFilledIcon,
} from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const classStyles = `
<style>
.more-detail > p {
  display: inline-block;
  margin: 4px 0;
}
.more-detail > p.title {
  width: 120px;
}
</style>
`;

export default function TableExpandable() {
  const getColumns = (isFixedColumn) => [
    { colKey: 'applicant', title: '申请人', width: '80', fixed: isFixedColumn ? 'left' : '' },
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
      fixed: isFixedColumn ? 'right' : '',
      cell: ({ row }) => (
        <Link theme="primary" hover="color">
          {row.status === 0 ? '查看详情' : '再次申请'}
        </Link>
      ),
    },
  ];

  const initialData = new Array(5).fill(null).map((item, i) => ({
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
        <b>申请人:</b>
      </p>
      <p className="content">{row.applicant}</p>
      <br />
      <p className="title">
        <b>邮箱地址:</b>
      </p>
      <p className="content">{row.detail.email}</p>
      <br />
      <p className="title">
        <b>签署方式:</b>
      </p>
      <p className="content">{row.channel}</p>
    </div>
  );

  const rehandleExpandChange = (value, params) => {
    setExpandedRowKeys(value);
    console.log('rehandleExpandChange', value, params);
  };

  // 完全自由控制表格的每一行是否显示展开图标，以及显示什么内容
  const tmpExpandIcon = ({ index }) => {
    // 第一行不显示展开图标
    if (index === 0) return false;
    // 第三行，使用自定义展开图标
    if (index === 3) return <ChevronRightIcon />;
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

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

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
        rowKey="index"
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
