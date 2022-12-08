import React, { useEffect, useState } from 'react';
import { Table } from 'tdesign-react';

const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 64,
  },
  {
    colKey: 'serial-number',
    title: '序号',
    width: 60,
  },
  {
    width: 200,
    colKey: 'name',
    title: '姓名',
    render({ row: { name } }) {
      return name ? `${name?.first} ${name?.last}` : 'UNKNOWN_USER';
    },
  },
  {
    width: 200,
    colKey: 'gender',
    title: '性别',
  },
  {
    width: 200,
    colKey: 'phone',
    title: '联系方式',
    render({ row: { phone } }) {
      return phone;
    },
  },
  {
    width: 260,
    colKey: 'email',
    title: '邮箱',
    ellipsis: true,
  },
];

export default function TableBasic() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // 分页数据变化
  async function rehandleChange(pageInfo) {
    const { current, pageSize } = pageInfo;
    setCurrent(current);
    setPageSize(pageSize);
    await fetchData(pageInfo);
  }

  // 模拟远程请求
  async function fetchData(pageInfo) {
    setIsLoading(true);
    try {
      const { current, pageSize } = pageInfo;
      // 请求可能存在跨域问题
      const url = new URL('https://randomuser.me/api');
      const params = { page: current, results: pageSize };
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
      const response = await fetch(url).then((x) => x.json());
      setData(response.results);
      setTotal(120);
      setIsLoading(false);
    } catch (err) {
      setData([]);
      setTotal(120);
      setIsLoading(false);
    }
  }

  const onSelectChange = (value, { selectedRowData }) => {
    setSelectedRowKeys(value);
    console.log(value, selectedRowData);
  };

  useEffect(() => {
    fetchData({ current, pageSize });
  }, []);

  return (
    <Table
      data={data}
      columns={columns}
      rowKey="phone"
      loading={isLoading}
      pagination={{
        current,
        pageSize,
        // 支持非受控用法
        // defaultCurrent: 1,
        // defaultPageSize: 5,
        total,
        showJumper: true,
        onChange(pageInfo, context) {
          console.log(pageInfo, 'onChange pageInfo');
          rehandleChange(pageInfo, context);
        },
      }}
      onPageChange={(pageInfo) => {
        console.log(pageInfo, 'onPageChange pageInfo');
      }}
      selectedRowKeys={selectedRowKeys}
      onSelectChange={onSelectChange}
      // reserveSelectedRowOnPaginate={false}
    />
  );
}
