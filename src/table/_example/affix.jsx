import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Space } from 'tdesign-react';

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
      index: i,
      platform: i % 2 === 0 ? '共有' : '私有',
      type: ['String', 'Number', 'Array', 'Object'][i % 4],
      default: ['-', '0', '[]', '{}'][i % 4],
      detail: {
        position: `读取 ${i} 个数据的嵌套信息值`,
      },
      required: i % 4 === 0 ? '是' : '否',
      description: '数据源',
      expo: 235245,
      click: 1653,
      ctr: '12%',
    });
  }
  return data;
}

const TOTAL = 38;

function getColumns({ fixedLeftColumn, fixedRightColumn }) {
  return [
    {
      align: 'center',
      className: 'row',
      colKey: 'index',
      title: '序号',
      foot: () => <b style={{ color: 'rgb(0, 82, 217)' }}>表尾</b>,
      fixed: fixedLeftColumn ? 'left' : undefined,
    },
    {
      colKey: 'platform',
      title: '平台',
      foot: ({ rowIndex }) => <span>第 {rowIndex + 1} 行</span>,
    },
    {
      colKey: 'type',
      title: '类型',
    },
    {
      colKey: 'expo',
      title: '曝光',
      foot: '-',
    },
    {
      colKey: 'click',
      title: '点击',
      foot: '-',
    },
    {
      colKey: 'ctr',
      title: '点击率',
      foot: '-',
    },
    {
      colKey: 'default',
      title: '默认值',
      foot: ({ row }) => <span>{row.default || '空'}</span>,
    },
    {
      colKey: 'required',
      title: '是否必传',
      // 使用插槽渲染，插槽名称为 't-foot-required'
      foot: 't-foot-required',
    },
    {
      colKey: 'detail.position',
      title: '详情信息',
      ellipsis: true,
      foot: () => <div>渲染函数输出表尾信息</div>,
    },
    {
      colKey: 'operation',
      title: '操作',
      cell: () => '查看',
      width: 80,
      foot: '-',
      fixed: fixedRightColumn ? 'right' : undefined,
    },
  ];
}

const TableAffixDemo = () => {
  const data = getData(TOTAL);
  // 表尾有一行数据
  const footData = [{ type: '全部类型', description: '-' }];
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
        tableLayout="auto"
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
