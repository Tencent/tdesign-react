import React, { useState } from 'react';
import { Table, Checkbox, Space, Tag } from 'tdesign-react';
import { CheckCircleFilledIcon, ErrorCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const columns = [
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
    sortType: 'all',
    sorter: true,
    cell: ({ rowIndex }) => {
      const status = rowIndex % 3;
      return (
        <Tag
          shape="round"
          theme={statusNameListMap[status].theme}
          variant="light-outline"
          icon={statusNameListMap[status].icon}
        >
          {statusNameListMap[status].label}
        </Tag>
      );
    },
  },
  {
    colKey: 'time',
    title: '申请耗时(天)',
    width: '140',
    align: 'center',
    sortType: 'all',
    sorter: true,
  },
  { colKey: 'channel', title: '签署方式', width: '120' },
  { colKey: 'createTime', title: '申请时间' },
];

const initialData = new Array(4).fill(null).map((_, i) => ({
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

export default function TableSingleSort() {
  const [data, setData] = useState([...initialData]);
  const [sort, setSort] = useState({
    // 按照 status 字段进行排序
    sortBy: 'status',
    // 是否按照降序进行排序
    descending: true,
  });
  const [hideSortTips, setHideSortTips] = useState(false);

  function onSortChange(sort) {
    setSort(sort);
    request(sort);
  }
  function request(sort) {
    // 模拟异步请求，进行数据排序
    const timer = setTimeout(() => {
      if (!sort || !sort.sortBy) {
        setData([...initialData]);
        return;
      }
      const dataNew = initialData
        .concat()
        .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
      setData([...dataNew]);
      clearTimeout(timer);
    }, 100);
  }

  return (
    <Space direction="vertical">
      <div>
        <Checkbox checked={hideSortTips} onChange={setHideSortTips}>
          隐藏排序文本提示
        </Checkbox>
        <span style={{ paddingLeft: '16px', verticalAlign: 'top' }}>排序方式：{JSON.stringify(sort)}</span>
      </div>

      <Table
        rowKey="index"
        data={data}
        columns={columns}
        sort={sort}
        hideSortTips={hideSortTips}
        showSortColumnBgColor={true}
        onSortChange={onSortChange}
      />
    </Space>
  );
}
