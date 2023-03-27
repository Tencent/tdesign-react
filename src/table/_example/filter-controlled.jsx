import React, { useState } from 'react';
import { Table, Button, DateRangePickerPanel, Space, Tag } from 'tdesign-react';
import isNumber from 'lodash/isNumber';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const columns = [
  { colKey: 'applicant', title: '申请人', width: 100, foot: '-' },
  {
    title: '申请状态',
    colKey: 'status',
    // 单选过滤配置
    filter: {
      type: 'single',
      list: [
        { label: '审批通过', value: 0 },
        { label: '已过期', value: 1 },
        { label: '审批失败', value: 2 },
      ],
      // 透传浮层全部属性，示例代码
      // popupProps: {
      //   placement: 'right',
      //   attach: () => document.body
      // },
    },
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
  {
    title: '签署方式',
    colKey: 'channel',
    // 多选过滤配置
    filter: {
      type: 'multiple',
      resetValue: [],
      list: [
        { label: 'All', checkAll: true },
        { label: '电子签署', value: '电子签署' },
        { label: '纸质签署', value: '纸质签署' },
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

// eslint-disable-next-line
function IconText(props = {}) {
  // 根据不同的 Props，允许定义不同的筛选图标（col, colIndex 在 Table 组件内部已经注入）
  const { col, colIndx } = props;
  console.log(col, colIndx);
  if (col.colKey === 'email') return <div>EmailIcon</div>;
  return <i>Icon</i>;
}

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  applicant: ['贾明', '张三', '王芳'][i % 3],
  status: i % 3,
  channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
  email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
  matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
  time: [2, 3, 1, 4][i % 4],
  createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
}));

export default function TableSingleSort() {
  const [data, setData] = useState([...initData]);
  //  survivalTime: [300, 500]
  const [filterValue, setFilterValue] = useState({
    lastName: [],
    createTime: [],
  });

  const request = (filters) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      const newData = initData.filter((item) => {
        let result = true;
        if (isNumber(filters.status)) {
          result = item.status === filters.status;
        }
        if (result && filters.channel && filters.channel.length) {
          result = filters.channel.includes(item.channel);
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
      <Space direction="horizontal" align="center">
        <Button
          onClick={() => {
            setFilterValue({});
            setData([...initData]);
          }}
        >
          清空已筛选
        </Button>
        <span>已选筛选条件：{JSON.stringify(filterValue)}</span>
      </Space>
      <Table
        rowKey="key"
        data={data}
        columns={columns}
        // filterIcon={<IconText />}
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
