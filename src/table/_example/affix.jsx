import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Space, Link, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const classStyles = `
<style>
/*
 * table-layout: auto 模式下，table 元素的宽度设置很重要很重要。
 * 如果不设置，列多了之后会挤在一起
 * **/
.tdesign-demo__table-affix table {
  width: 1200px;
}

.tdesign-demo__table-affix .t-table {
  max-width: 800px;
}
</style>
`;

function getData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
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
  return data;
}

const TOTAL = 38;

function getColumns({ fixedLeftColumn, fixedRightColumn }) {
  return [
    {
      align: 'left',
      colKey: 'applicant',
      title: '申请人',
      foot: () => <b style={{ fontWeight: 'bold' }}>表尾信息</b>,
      width: '120',
      fixed: fixedLeftColumn ? 'left' : undefined,
    },
    {
      colKey: 'status',
      title: '申请状态',
      width: '150',
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
    { colKey: 'channel', title: '签署方式', width: '120' },
    { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
    { colKey: 'matters', title: '申请事项', ellipsis: true },
    { colKey: 'createTime', title: '申请时间' },
    {
      colKey: 'operation',
      title: '操作',
      cell: ({ row }) => (
        <Link hover="color" theme="primary">
          {row.status === 0 ? '查看详情' : '再次申请'}
        </Link>
      ),
      width: 120,
      foot: '-',
      fixed: fixedRightColumn ? 'right' : undefined,
    },
  ];
}

const TableAffixDemo = () => {
  const data = getData(TOTAL);
  // 表尾有一行数据
  const footData = [{ index: 'footer-row-1', type: '全部类型', description: '-' }];
  const [columns, setColumns] = useState([]);

  // 重要：如果在预渲染场景下，初次渲染的表格宽度和最终呈现宽度不一样，请异步设置表头吸顶
  const [headerAffixedTop, setHeaderAffixedTop] = useState(true);
  const [footerAffixedBottom, setFooterAffixedBottom] = useState(true);
  const [fixedLeftColumn, setFixedLeftColumn] = useState(true);
  const [fixedRightColumn, setFixedRightColumn] = useState(true);
  const [horizontalScrollAffixedBottom, setHorizontalScrollAffixedBottom] = useState(false);
  const [paginationAffixedBottom, setPaginationAffixedBottom] = useState(false);

  // type 可选值：foot 和 body
  function rowClassName({ type }) {
    if (type === 'foot') return 't-tdesign__custom-footer-tr';
    return 't-tdesign__custom-body-tr';
  }

  function onDragSortChange({ newData }) {
    setColumns(newData);
  }

  // 表尾吸顶和底部滚动条，二选一即可，也只能二选一
  useEffect(() => {
    horizontalScrollAffixedBottom && setFooterAffixedBottom(false);
  }, [horizontalScrollAffixedBottom]);

  // 表尾吸顶和底部滚动条，二选一即可，也只能二选一
  useEffect(() => {
    footerAffixedBottom && setHorizontalScrollAffixedBottom(false);
  }, [footerAffixedBottom]);

  // 左侧固定列或者右侧固定列发生变化时
  useEffect(() => {
    const tmp = getColumns({
      fixedLeftColumn,
      fixedRightColumn,
    });
    setColumns(tmp);
  }, [fixedLeftColumn, fixedRightColumn]);

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const marginStyle = {
    marginLeft: '32px',
  };

  return (
    <Space direction="vertical" size="large" className="tdesign-demo__table-affix" style={{ width: '100%' }}>
      <div>
        <Checkbox checked={headerAffixedTop} onChange={setHeaderAffixedTop}>
          表头吸顶
        </Checkbox>
        <Checkbox checked={footerAffixedBottom} onChange={setFooterAffixedBottom} style={marginStyle}>
          表尾吸底
        </Checkbox>
        <Checkbox
          checked={horizontalScrollAffixedBottom}
          onChange={setHorizontalScrollAffixedBottom}
          style={marginStyle}
        >
          滚动条吸底
        </Checkbox>
        <Checkbox checked={paginationAffixedBottom} onChange={setPaginationAffixedBottom} style={marginStyle}>
          分页器吸底
        </Checkbox>
        <Checkbox checked={fixedLeftColumn} onChange={setFixedLeftColumn} style={marginStyle}>
          固定左侧列
        </Checkbox>
        <Checkbox checked={fixedRightColumn} onChange={setFixedRightColumn} style={marginStyle}>
          固定右侧列
        </Checkbox>
      </div>
      <Table
        rowKey="index"
        data={data}
        columns={columns}
        footData={footData}
        rowClassName={rowClassName}
        pagination={{ defaultCurrent: 1, defaultPageSize: 5, total: TOTAL }}
        headerAffixedTop={{ offsetTop: 87, zIndex: 1000 }}
        footerAffixedBottom={
          footerAffixedBottom ? { offsetBottom: paginationAffixedBottom ? 60 : 0, zIndex: 1000 } : false
        }
        horizontalScrollAffixedBottom={
          horizontalScrollAffixedBottom ? { offsetBottom: paginationAffixedBottom ? 61 : 0, zIndex: 1000 } : false
        }
        paginationAffixedBottom={paginationAffixedBottom}
        tableLayout="fixed"
        dragSort="col"
        bordered
        resizable
        onDragSort={onDragSortChange}
      ></Table>
    </Space>
  );
};

TableAffixDemo.displayName = 'TableAffixDemo';

export default TableAffixDemo;
