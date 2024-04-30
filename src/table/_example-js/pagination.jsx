import React, { useState } from 'react';
import { Table, Space, Radio, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const data = [];
const total = 59;
for (let i = 0; i < total; i++) {
  data.push({
    index: i,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const columns = [
  { colKey: 'serial-number', width: 80, title: '序号' },
  { colKey: 'applicant', title: '申请人', width: '100' },
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
  { colKey: 'channel', title: '签署方式', width: '120' },
  // { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' },
  { colKey: 'row-select', type: 'multiple', width: 46 },
];

export default function TableBasic() {
  const [reserveSelectedRowOnPaginate, setReserveSelectedRowOnPaginate] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [current, setCurrent] = useState(2);
  // const [pageSize, setPageSize] = useState(5);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group
        variant="default-filled"
        value={reserveSelectedRowOnPaginate}
        onChange={setReserveSelectedRowOnPaginate}
      >
        <Radio.Button value={true}>跨分页选中</Radio.Button>
        <Radio.Button value={false}>当前页选中</Radio.Button>
      </Radio.Group>

      <Table
        id="pagination-table"
        data={data}
        columns={columns}
        rowKey="index"
        // 非受控写法
        pagination={{
          defaultCurrent: 2,
          defaultPageSize: 5,
          total,
          showJumper: true,
          onChange(pageInfo) {
            console.log(pageInfo, 'onChange pageInfo');
          },
          onCurrentChange(current, pageInfo) {
            console.log(current, 'onCurrentChange current');
            console.log(pageInfo, 'onCurrentChange pageInfo');
          },
          onPageSizeChange(size, pageInfo) {
            console.log(size, 'onPageSizeChange size');
            console.log(pageInfo, 'onPageSizeChange pageInfo');
          },
          selectProps: {
            popupProps: {
              attach: () => document.getElementById('pagination-table'),
            },
          },
        }}
        // 受控用法：与分页组件对齐
        // pagination={{
        //   current,
        //   pageSize,
        //   showJumper: true,
        //   total,
        //   onChange(pageInfo) {
        //     console.log(pageInfo, 'onChange pageInfo');
        //     setCurrent(pageInfo.current);
        //     setPageSize(pageInfo.pageSize);
        //   },
        // }}
        onPageChange={(pageInfo, newDataSource) => {
          console.log(pageInfo, 'onPageChange pageInfo');
          console.log(newDataSource, 'onPageChange newDataSource');
        }}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={(val, context) => {
          setSelectedRowKeys(val);
          console.log(val, context);
        }}
        reserveSelectedRowOnPaginate={reserveSelectedRowOnPaginate}
      />
    </Space>
  );
}
