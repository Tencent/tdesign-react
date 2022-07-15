import React, { useState } from 'react';
import { Table, Button, DateRangePickerPanel, Space } from 'tdesign-react';

const columns = [
  {
    colKey: 'instance',
    title: '集群名称',
    // filter: {
    //   type: 'single',
    //   list: [
    //     { label: 'any one', value: '' },
    //     { label: 'JQTest1', value: 'JQTest1' },
    //     { label: 'JQTest2', value: 'JQTest2' },
    //     { label: 'JQTest3', value: 'JQTest3' },
    //   ],
    // },
  },
  {
    colKey: 'survivalTime',
    title: '存活时间',
    sorter: (a, b) => a.survivalTime - b.survivalTime,
    filter: {
      type: 'single',
      // showConfirmAndReset: true,
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
    filter: {
      type: 'input',
      showConfirmAndReset: true,
      // 自定义触发搜索确认的事件
      confirmEvents: ['onEnter'],
      props: {
        placeholder: '请输入关键词搜索',
      },
    },
  },
  {
    colKey: 'area',
    title: '区域',
    filter: {
      type: 'multiple',
      showConfirmAndReset: true,
      list: [
        { label: '广州', value: '广州' },
        { label: '成都', value: '成都' },
        { label: '深圳', value: '深圳' },
      ],
    },
  },
  {
    title: '自定义过滤',
    colKey: 'createTime',
    // 自定义过滤组件
    filter: {
      // 直接传入组件，请确保自定义过滤组件包含 value 和 onChange 等两个参数，组件内部会自动处理
      component: DateRangePickerPanel,
      props: {
        firstDayOfWeek: 7,
      },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
      // 日期范围是一个组件，重置时需赋值为 []
      resetValue: [],
    },
  },
];
const initData = [
  {
    id: 1,
    instance: 'JQTest1',
    status: 0,
    owner: 'jenny;peter',
    survivalTime: 300,
    area: '广州',
    createTime: '2021-11-01',
  },
  { id: 2, instance: 'JQTest2', status: 1, owner: 'jenny', survivalTime: 1000, area: '上海', createTime: '2021-12-01' },
  { id: 3, instance: 'JQTest3', status: 2, owner: 'jenny', survivalTime: 500, area: '北京', createTime: '2022-01-01' },
  { id: 4, instance: 'JQTest4', status: 1, owner: 'peter', survivalTime: 1500, area: '成都', createTime: '2022-02-01' },
  { id: 5, instance: 'JQTest5', status: 1, owner: 'jeff', survivalTime: 500, area: '深圳', createTime: '2022-03-01' },
  { id: 6, instance: 'JQTest1', status: 1, owner: 'tony', survivalTime: 800, area: '南京', createTime: '2022-04-01' },
];
export default function TableSingleSort() {
  const [data, setData] = useState([...initData]);
  //  survivalTime: [300, 500]
  const [filterValue, setFilterValue] = useState({});

  function onFilterChange(filterVal, col) {
    console.log(filterVal, col);
    setFilterValue(filterVal);
    // TODO: 在此处理过滤数据效果，以达到更真实的过滤效果
  }

  function onChange(info, context) {
    console.log('onChange', info, context);
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
    <Space direction="vertical">
      <div>
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
        filterValue={filterValue}
        // defaultFilterValue={filterValue}
        onFilterChange={onFilterChange}
        onChange={onChange}
        // 非受控写法
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: 5,
          showJumper: true,
          pageSizeOptions: [1, 3, 5, 10],
        }}
      />
    </Space>
  );
}
