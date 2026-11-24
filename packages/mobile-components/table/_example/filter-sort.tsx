import React, { useState } from 'react';
import { FilterValue, PrimaryTableCol, PrimaryTableProps, SortInfo, Table, TableSort, Tag } from 'tdesign-mobile-react';
import { isNumber } from 'lodash-es';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success' },
  1: { label: '审批失败', theme: 'danger' },
  2: { label: '审批过期', theme: 'warning' },
};
const initData: PrimaryTableProps['data'] = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  applicant: ['贾明', '张三', '王芳'][i % 3],
  status: i % 3,
  channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
  email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
  matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
  time: [2, 3, 1, 4][i % 4],
  createTime: [20220101, 20220201, 20220301, 20220401, 20220501][i % 4],
}));

export default function FilterSortExample() {
  const [data, setData] = useState([...initData]);
  const [filterValue, setFilterValue] = useState<PrimaryTableProps['filterValue']>({
    lastName: [],
  });
  const [sort, setSort] = useState<TableSort>();
  const columns: Array<PrimaryTableCol> = [
    { colKey: 'applicant', title: '申请人', align: 'center' },
    {
      title: '申请状态',
      colKey: 'status',
      width: 120,
      align: 'center',
      // 单选过滤配置
      filter: {
        type: 'single',
        list: [
          { label: '审批通过', value: 0 },
          { label: '已过期', value: 1 },
          { label: '审批失败', value: 2 },
        ],
        showConfirmAndReset: true,
      },
      cell: ({ row }) => (
        <Tag theme={statusNameListMap[row.status].theme} variant="light">
          {statusNameListMap[row.status].label}
        </Tag>
      ),
    },
    {
      title: '签署方式',
      colKey: 'channel',
      width: 120,
      align: 'center',
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
      width: 180,
      align: 'center',
      // 输入框过滤配置
      filter: {
        type: 'input',
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
      width: 100,
      align: 'center',
      // 用于查看同时存在排序和过滤时的图标显示是否正常
      sorter: true,
    },
  ];

  const request = (filters: FilterValue) => {
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

  const sortRequest = (sort: SortInfo) => {
    // 模拟异步请求，进行数据排序
    const timer = setTimeout(() => {
      if (!sort || !sort.sortBy) {
        setData([...initData]);
        return;
      }
      const dataNew = initData
        .concat()
        .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
      setData([...dataNew]);
      clearTimeout(timer);
    }, 100);
  };

  const onFilterChange: PrimaryTableProps['onFilterChange'] = (filters, col) => {
    console.log(filters, col);
    setFilterValue({
      ...filters,
      createTime: filters.createTime || [],
      lastName: filters.lastName || [],
    });
    // 在此处理过滤数据效果，以达到更真实的过滤效果
    request(filters);
  };

  const onSortChange = (sort: SortInfo) => {
    setSort(sort);
    sortRequest(sort);
  };

  const onChange: PrimaryTableProps['onChange'] = (info, context) => {
    console.log('onChange', info, context);
  };

  return (
    <Table
      showHeader
      columns={columns}
      data={data}
      cellEmptyContent="暂无数据"
      rowKey="index"
      sort={sort}
      filterValue={filterValue}
      // defaultFilterValue={filterValue}
      onFilterChange={onFilterChange}
      onChange={onChange}
      onSortChange={onSortChange}
      // filterRow={() => null}
      // 非受控写法
      pagination={{
        defaultCurrent: 1,
        defaultPageSize: 5,
        showJumper: true,
        pageSizeOptions: [1, 3, 5, 10],
      }}
    />
  );
}
