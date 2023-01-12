import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    width: 46,
  },
  {
    width: 200,
    colKey: 'name',
    title: '姓名',
    render({ type, row: { name } }) {
      if (type === 'title') return '申请人';
      return name ? `${name.first} ${name.last}` : 'UNKNOWN_USER';
    },
  },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
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
    width: 200,
    colKey: 'phone',
    title: '联系方式',
    render({ row: { phone } }) {
      return phone;
    },
  },
  {
    colKey: 'email',
    title: '邮箱',
    width: 180,
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
