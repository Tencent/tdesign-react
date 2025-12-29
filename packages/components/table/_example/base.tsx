/* eslint-disable camelcase */
import React, { useState } from 'react';
import type { FilterValue, TableProps } from 'tdesign-react';
import { DialogPlugin, Link, Table } from 'tdesign-react';
import { v4 as uuidv4 } from 'uuid';

interface ITableMaxHeightParams {
  topPosStart?: number;
  reservationHeight?: number;
  heightLowerLimit?: number;
  heightUpperLimit?: number;
  viewHeight?: number;
}

const getTableMaxHeight = (params: ITableMaxHeightParams = {}): number => {
  const {
    topPosStart = 0,
    reservationHeight = 0,
    heightLowerLimit = 500,
    heightUpperLimit = 1200,
    viewHeight = window.innerHeight,
  } = params;

  let tableHeight = viewHeight - topPosStart - reservationHeight;
  if (tableHeight < heightLowerLimit) {
    tableHeight = heightLowerLimit;
  }
  if (tableHeight > heightUpperLimit) {
    tableHeight = heightUpperLimit;
  }

  return tableHeight;
};

// 工具函数：随机加权选择
function randomWeightedChoice(items: string[], weights: number[]) {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must have the same length.');
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const random = Math.random() * totalWeight;

  let weightSum = 0;
  for (let i = 0; i < items.length; i++) {
    weightSum += weights[i];
    if (random <= weightSum) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

// 生成随机数据
const getRandomData = (rowCount = 500) => {
  const upperLimit = 1000;
  const result: TableProps['data'] = new Array(rowCount).fill(null).map((_, i) => {
    const type_name = randomWeightedChoice(['电脑', '平板', '手机'], [0.75, 0.2, 0.05]);
    let typeLabel = '';
    if (type_name === '电脑') typeLabel = 'Computer';
    else if (type_name === '平板') typeLabel = 'Tablet';
    else if (type_name === '手机') typeLabel = 'Phone';

    return {
      id: uuidv4(),
      model_name: `Model_Name_${typeLabel}_${i.toString().padStart(4, '0')}`,
      type_name,
      quantity_1: Math.floor(Math.random() * upperLimit),
      quantity_2: Math.floor(Math.random() * upperLimit),
      quantity_3: Math.floor(Math.random() * upperLimit),
      quantity_4: Math.floor(Math.random() * upperLimit),
      quantity_5: Math.floor(Math.random() * upperLimit),
      quantity_6: Math.floor(Math.random() * upperLimit),
    };
  });

  return result;
};

// 数字格式化函数
function numeral(value: number | string | null | undefined) {
  const num = Number(value) || 0;

  return {
    format(pattern: string): string {
      const hasComma = pattern.includes(',');
      const decimalMatch = pattern.match(/\.(0+)/);
      const decimals = decimalMatch ? decimalMatch[1].length : 0;

      return num.toLocaleString('en-US', {
        useGrouping: hasComma,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    },
  };
}

// 表格组件接口
interface TableDemoProps {
  tableMaxHeight: number;
  filterProductNames?: string[];
  enableVirtualScroll?: boolean;
  onClickCallback?: () => void;
}

// 表格组件
const TableDemo: React.FC<TableDemoProps> = ({
  tableMaxHeight,
  filterProductNames,
  enableVirtualScroll = false,
  onClickCallback,
}) => {
  const ranDatas = React.useMemo(() => getRandomData(), []);
  const [filterValue, setFilterValue] = useState<FilterValue>({});

  const onFilterChange: TableProps['onFilterChange'] = (filterValue) => {
    setFilterValue(filterValue);
  };

  const onClickDrillDown = (row: any) => {
    const { props } = row.row_shared;
    props.onClickCallback?.();
  };

  const columns: TableProps['columns'] = [
    { colKey: 'serial-number', title: '序号', width: 60, align: 'center' },
    {
      colKey: 'model_name',
      title: '名称',
      width: 160,
      align: 'left',
      sortType: 'asc',
      sorter: (a: any, b: any) => a.model_name.localeCompare(b.model_name),
      foot: (col: any) => (
        <div style={{ textAlign: 'left' }}>
          <b style={{ fontWeight: 'bold' }}>{`全部（${col.row.total_rows}）`}</b>
        </div>
      ),
    },
    {
      colKey: 'type_name',
      title: '类型',
      width: 100,
      align: 'center',
      sortType: 'asc',
      sorter: (a: any, b: any) => a.type_name.localeCompare(b.type_name),
      filter: {
        type: 'multiple',
        resetValue: [],
        list: [
          { label: '全部', checkAll: true },
          { label: '电脑', value: '电脑' },
          { label: '平板', value: '平板' },
          { label: '手机', value: '手机' },
        ],
      },
    },
    {
      colKey: 'quantity_1',
      title: 'AAA数量1',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => (
        <Link theme="primary" onClick={() => onClickDrillDown(row)}>
          {numeral(row.quantity_1).format('0,0')}
        </Link>
      ),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_1 - b.quantity_1,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>
            <Link theme="primary" onClick={() => onClickDrillDown(col.row)}>
              {numeral(col.row.quantity_1).format('0,0')}
            </Link>
          </b>
        </div>
      ),
    },
    {
      colKey: 'quantity_2',
      title: 'AAA数量2',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => numeral(row.quantity_2).format('0,0'),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_2 - b.quantity_2,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>{numeral(col.row.quantity_2).format('0,0')}</b>
        </div>
      ),
    },
    {
      colKey: 'quantity_3',
      title: 'AAA数量3',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => numeral(row.quantity_3).format('0,0'),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_3 - b.quantity_3,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>{numeral(col.row.quantity_3).format('0,0')}</b>
        </div>
      ),
    },
    {
      colKey: 'quantity_4',
      title: '表格标题-数量4',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => numeral(row.quantity_4).format('0,0'),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_4 - b.quantity_4,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>{numeral(col.row.quantity_4).format('0,0')}</b>
        </div>
      ),
    },
    {
      colKey: 'quantity_5',
      title: 'AAA数量5',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => numeral(row.quantity_5).format('0,0'),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_5 - b.quantity_5,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>{numeral(col.row.quantity_5).format('0,0')}</b>
        </div>
      ),
    },
    {
      colKey: 'quantity_6',
      title: 'AA数量6',
      width: 100,
      align: 'right',
      cell: ({ row }: any) => numeral(row.quantity_6).format('0,0'),
      sortType: 'desc',
      sorter: (a: any, b: any) => a.quantity_6 - b.quantity_6,
      foot: (col: any) => (
        <div style={{ textAlign: 'right' }}>
          <b style={{ fontWeight: 'bold' }}>{numeral(col.row.quantity_6).format('0,0')}</b>
        </div>
      ),
    },
  ];

  // 列筛选函数
  const getFilterRows = (tableRows: any[], columnFilter: FilterValue) => {
    const filterRows = tableRows.filter((row) =>
      Object.keys(columnFilter).every((key) => {
        const filterValues = columnFilter[key];
        if (Array.isArray(filterValues) && filterValues.length === 0) {
          return true;
        }
        return Array.isArray(filterValues) && filterValues.includes(row[key]);
      }),
    );

    return filterRows;
  };

  // 计算汇总数据
  const getFootCumulativeData = (rowDatas: any[]) => {
    const result: { [key: string]: any } = {};
    const cumProps = ['quantity_1', 'quantity_2', 'quantity_3', 'quantity_4', 'quantity_5', 'quantity_6'];

    cumProps.forEach((prop) => {
      result[prop] = rowDatas.reduce((acc, row) => acc + row[prop], 0);
    });

    return result;
  };

  // 计算表格数据
  const computedProps = React.useMemo(() => {
    let tableRows = ranDatas.map((row: any) => ({ ...row, row_shared: { props: { onClickCallback } } }));

    // 产品筛选
    if (filterProductNames && filterProductNames.length > 0) {
      tableRows = tableRows.filter((row) => filterProductNames.includes(row.model_name));
    }

    // 列筛选
    tableRows = getFilterRows(tableRows, filterValue);

    const cumRow = getFootCumulativeData(tableRows);
    const footRows = [
      {
        ...cumRow,
        total_rows: tableRows.length,
        row_shared: { props: { onClickCallback } },
      },
    ];
    return { tableRows, footRows };
  }, [ranDatas, onClickCallback, filterProductNames, filterValue]);

  const isEmptyFilter = Object.entries(filterValue).every(([, value]) => Array.isArray(value) && value.length === 0);

  return (
    <Table
      rowKey="id"
      data={computedProps.tableRows}
      footData={computedProps.footRows}
      columns={columns}
      resizable={true}
      tableLayout="fixed"
      maxHeight={tableMaxHeight}
      hideSortTips={true}
      footerAffixedBottom={false}
      filterValue={filterValue}
      filterRow={isEmptyFilter ? null : undefined}
      onFilterChange={onFilterChange}
      scroll={enableVirtualScroll ? { type: 'virtual' } : undefined}
    />
  );
};

// 主组件
const enableVirtualScroll = true;

const showDialog = () => {
  const defaultDlgRestHeightExceptBody = 170;
  const tableMaxHeight = getTableMaxHeight({ reservationHeight: 100 + defaultDlgRestHeightExceptBody });
  const dialogBody = (
    <TableDemo onClickCallback={showDialog} tableMaxHeight={tableMaxHeight} enableVirtualScroll={enableVirtualScroll} />
  );
  const dlgInstance = DialogPlugin({
    header: '递进查询',
    body: dialogBody,
    onClose: () => {
      dlgInstance.destroy();
    },
    confirmBtn: null,
    cancelBtn: '关闭',
    width: '80%',
    top: '32px',
    draggable: true,
  });
};

export default function App() {
  const tableMaxHeight = getTableMaxHeight({ reservationHeight: 35 });

  return (
    <div
    //  style={{ width: 1400 }}
    >
      <style>{`body{margin:8px}`}</style>
      <TableDemo
        onClickCallback={showDialog}
        tableMaxHeight={tableMaxHeight}
        enableVirtualScroll={enableVirtualScroll}
      />
    </div>
  );
}
