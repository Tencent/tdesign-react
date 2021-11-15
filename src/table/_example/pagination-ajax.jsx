import React, { useEffect, useState } from 'react';
import { Table } from 'tdesign-react';

const dataSource = [];
const total = 60;
for (let i = 0; i < total; i++) {
  dataSource.push({
    index: i,
    platform: '公有',
    type: 'any[]',
    default: '[]',
    needed: 'Y',
    description: '数据源',
    detail: {
      name: '嵌套信息读取',
    },
  });
}
const columns = [
  {
    align: 'center',
    width: 100,
    minWidth: 100,
    className: 'row',
    ellipsis: true,
    colKey: 'index',
    title: 'index',
  },
  {
    align: 'left',
    width: 100,
    minWidth: 100,
    className: 'test',
    ellipsis: true,
    colKey: 'platform',
    title: '平台',
  },
  {
    align: 'left',
    className: 'test4',
    ellipsis: true,
    colKey: 'default',
    title: '默认值',
  },
  {
    align: 'left',
    width: 100,
    minWidth: 100,
    className: 'test3',
    ellipsis: true,
    colKey: 'needed',
    title: '是否必传',
  },
  {
    align: 'left',
    width: 100,
    minWidth: 100,
    className: 'test3',
    ellipsis: true,
    colKey: 'detail.name',
    title: '详情信息',
  },
  {
    align: 'left',
    width: 100,
    minWidth: 100,
    className: 'row',
    ellipsis: true,
    colKey: 'description',
    title: '说明',
  },
];

export default function TableBasic() {
  const [isLoading, setIsloading] = useState(false);
  const [data, setData] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 分页数据变化
  async function rehandleChange(pageInfo) {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
    await fetchData(pageInfo);
  }

  // 模拟远程请求
  async function fetchData(pageInfo) {
    setIsloading(true);
    try {
      setTimeout(() => {
        const { current, pageSize } = pageInfo;
        const newDataSource = dataSource.slice((current - 1) * pageSize, current * pageSize);
        console.log('分页数据', newDataSource);
        setData(newDataSource);
        setIsloading(false);
      }, 300);
    } catch (err) {
      setData([]);
    }
  }

  useEffect(() => {
    fetchData({ current, pageSize });
  }, []);

  return (
    <Table
      data={data}
      columns={columns}
      rowKey="index"
      tableLayout="auto"
      verticalAlign="top"
      loading={isLoading}
      size="small"
      bordered
      hover
      stripe
      rowClassName={(rowKey) => `${rowKey}-class`}
      pagination={{
        current,
        pageSize,
        total,
        showJumper: true,
        showSizer: true,
        visibleWithOnePage: true,
        onChange(pageInfo) {
          console.log(pageInfo, 'onChange pageInfo');
          rehandleChange(pageInfo);
        },
      }}
    />
  );
}
