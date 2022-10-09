import React, { useState } from 'react';
import { Table, Button, DateRangePickerPanel, Space } from 'tdesign-react';

const columns = [
  {
    title: 'FirstName',
    colKey: 'firstName',
    // 单选过滤配置
    filter: {
      type: 'single',
      list: [
        { label: 'anyone', value: '' },
        { label: 'Heriberto', value: 'Heriberto' },
        { label: 'Eric', value: 'Eric' },
      ],
    },
  },
  {
    title: 'LastName',
    colKey: 'lastName',
    // 多选过滤配置
    filter: {
      type: 'multiple',
      resetValue: [],
      list: [
        { label: 'All', checkAll: true },
        { label: 'Skures', value: 'Skures' },
        { label: 'Purves', value: 'Purves' },
      ],
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Email',
    colKey: 'email',
    // 输入框过滤配置
    filter: {
      type: 'input',

      // 文本域搜索
      // component: Textarea,

      resetValue: '',
      // 按下 Enter 键时也触发确认搜索
      confirmEvents: ['onEnter'],
      props: { placeholder: '输入关键词过滤' },
      // 是否显示重置取消按钮，一般情况不需要显示
      showConfirmAndReset: true,
    },
  },
  {
    title: 'Date',
    colKey: 'createTime',
    // 用于查看同时存在排序和过滤时的图标显示是否正常
    sorter: true,
    // 自定义过滤组件：日期过滤配置，请确保自定义组件包含 value 和 onChange 属性
    filter: {
      type: 'custom',
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

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['Eric', 'Gilberta', 'Heriberto', 'Lazarus', 'Zandra'][i % 4],
  lastName: ['Spinke', 'Purves', 'Kment', 'Skures', 'Croson'][i % 4],
  email: [
    'espinke0@apache.org',
    'gpurves1@issuu.com',
    'hkment2@nsw.gov.au',
    'lskures3@apache.org',
    'zcroson5@virginia.edu',
  ][i % 4],
  createTime: ['2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01'][i % 4],
}));

export default function TableSingleSort() {
  const [data, setData] = useState([...initData]);
  //  survivalTime: [300, 500]
  const [filterValue, setFilterValue] = useState({
    lastName: [], createTime: [],
  });

  const request = (filters) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      const newData = initData.filter((item) => {
        let result = true;
        if (filters.firstName) {
          result = item.firstName === filters.firstName;
        }
        if (result && filters.lastName && filters.lastName.length) {
          result = filters.lastName.includes(item.lastName);
        }
        if (result && filters.email) {
          result = item.email.indexOf(filters.email) !== -1;
        }
        if (result && filters.createTime && filters.createTime.length) {
          result = item.createTime === filters.createTime;
        }
        return result;
      });
      setData(newData);
    }, 100);
  };

  function onFilterChange(filters, col) {
    console.log(filters, col);
    setFilterValue({
      ...filters,
      createTime: filters.createTime || [],
      lastName: filters.lastName || [],
    });
    // 在此处理过滤数据效果，以达到更真实的过滤效果
    request(filters);
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
        rowKey="key"
        data={data}
        columns={columns}
        // filterIcon={<IconFont name="add-circle" size="1em" />}
        filterValue={filterValue}
        // defaultFilterValue={filterValue}
        onFilterChange={onFilterChange}
        onChange={onChange}
        // filterRow={() => null}
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
