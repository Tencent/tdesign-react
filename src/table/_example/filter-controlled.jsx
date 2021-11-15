import React, { useState } from 'react';
import { Table, Button } from 'tdesign-react';

const columns = [
  {
    colKey: 'instance',
    title: '集群名称',
    filter: {
      type: 'single',
      list: [
        { label: 'any one', value: '' },
        { label: 'JQTest1', value: 'JQTest1' },
        { label: 'JQTest2', value: 'JQTest2' },
        { label: 'JQTest3', value: 'JQTest3' },
      ],
    },
    width: 100,
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cell({ row }) {
      switch (row.status) {
        case 0:
          return <p className="status">健康</p>;
        case 1:
          return <p className="status warning">警告</p>;
        case 2:
          return <p className="status unhealth">异常</p>;
        default:
          return null;
      }
    },
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
    width: 150,
    sortType: 'all',
    sorter: true,
    filter: {
      type: 'multiple',
      list: [
        { label: '300', value: 300 },
        { label: '500', value: 500 },
        { label: '1000', value: 1000 },
      ],
    },
  },
  {
    colKey: 'owner',
    title: '管理员',
    width: 100,
    filter: {
      type: 'input',
    },
  },
  {
    colKey: 'area',
    title: '区域',
    width: 100,
    filter: {
      type: 'multiple',
      list: [
        { label: '广州', value: '广州' },
        { label: '成都', value: '成都' },
        { label: '深圳', value: '深圳' },
      ],
    },
  },
];
const initData = [
  { id: 1, instance: 'JQTest1', status: 0, owner: 'jenny;peter', survivalTime: 300, area: '广州' },
  { id: 2, instance: 'JQTest2', status: 1, owner: 'jenny', survivalTime: 1000, area: '上海' },
  { id: 3, instance: 'JQTest3', status: 2, owner: 'jenny', survivalTime: 500, area: '北京' },
  { id: 4, instance: 'JQTest4', status: 1, owner: 'peter', survivalTime: 1500, area: '成都' },
  { id: 5, instance: 'JQTest5', status: 1, owner: 'jeff', survivalTime: 500, area: '深圳' },
  { id: 6, instance: 'JQTest1', status: 1, owner: 'tony', survivalTime: 800, area: '南京' },
];
export default function TableSingleSort() {
  const [data, setData] = useState([...initData]);
  const [filterValue, setFilterValue] = useState({ survivalTime: [300, 500] });

  function onFilterChange(_filterVal, col) {
    console.log(_filterVal, col);
    setFilterValue(_filterVal);
  }

  // 受控方式，打开模拟排序（可用，勿删）
  // useEffect(() => {
  //   request(filterValue);
  // }, [filterValue]);

  // 模拟异步请求，进行数据排序（可用，勿删）
  // function request(filterVal) {
  //   const timer = setTimeout(() => {
  //     if (!filterVal) {
  //       setData([...initData]);
  //       return;
  //     }
  //     let dataNew = initData;
  //     for (const k in filterVal) {
  //       if (typeof filterVal?.[k] === 'string') {
  //         dataNew = dataNew.filter((item) => item?.[k].indexOf(filterVal?.[k]) != -1);
  //       }
  //       if (typeof filterVal?.[k] === 'object' && filterVal?.[k].length > 0) {
  //         dataNew = dataNew
  //           .filter((item) => filterVal?.[k].indexOf(item?.[k]) != -1)
  //           .map((item) => ({ ...item, instance: `${item.instance}_TDesign_Filter` }));
  //       }
  //     }
  //     setData([...dataNew]);
  //     clearTimeout(timer);
  //   }, 100);
  // }
  return (
    <div className="demo-container">
      <div className="table-operations" style={{ marginBottom: '16px' }}>
        <Button
          onClick={() => {
            setFilterValue({});
            setData([...initData]);
          }}
        >
          清空已筛选
        </Button>
        <span>已选筛选条件：{JSON.stringify(filterValue)}</span>
      </div>
      <Table
        rowKey="id"
        data={data}
        columns={columns}
        // filterIcon={<IconFont name="add-circle" size="1em" />}
        // filterValue={filterValue}
        defaultFilterValue={filterValue}
        onFilterChange={onFilterChange}
        onSortChange={(v) => {
          console.log('排序变化', v);
        }}
      />
    </div>
  );
}
