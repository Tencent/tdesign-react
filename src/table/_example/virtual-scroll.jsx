import React, { useRef, useState } from 'react';
import { Table, Space, Button, Checkbox, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

function getTableData() {
  const initialData = [];
  for (let i = 0; i < 10; i++) {
    initialData.push({
      id: i + 1,
      applicant: ['贾明', '张三', '王芳'][i % 3],
      channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
      detail: {
        email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
      },
      matters: ['部分宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
      time: [2, 3, 1, 4][i % 4],
      createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
    });
  }

  const times = Array.from(new Array(1000), () => '');
  const testData = [];
  times.forEach((item, i) => {
    const k = i % 10;
    testData[i] = { ...initialData[k], id: i + 1 };
  });
  return testData;
}

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

/**
 * Start Here
 */
const TableVirtualScroll = () => {
  const tableRef = useRef(null);
  const [bordered, setBordered] = useState(true);
  const [data] = useState([...getTableData()]);

  const scrollToElement = () => {
    tableRef.current.scrollToElement({
      // 跳转元素下标（第 256 个元素位置）
      index: 255,
      // 滚动元素距离顶部的距离（如表头高度）
      top: 47,
      // 高度动态变化场景下，即 isFixedRowHeight = false。延迟设置元素位置，一般用于依赖不同高度异步渲染等场景，单位：毫秒。（固定高度不需要这个）
      time: 60,
    });
  };

  const columns = [
    { colKey: 'serial-number', width: 70, title: '序号' },
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
    { colKey: 'matters', title: '申请事项', width: '140' },
    { colKey: 'detail.email', title: '邮箱地址' },
    { colKey: 'createTime', title: '申请时间' },
  ];

  const height = 300;
  // const [height, setHeight] = useState(300);

  // const setLowerHeight = () => {
  //   setHeight(150);
  // };

  // const setHigherHeight = () => {
  //   setHeight(600);
  // };

  return (
    <Space direction="vertical">
      <Space align="center">
        <Button onClick={scrollToElement}>滚动到指定元素</Button>
        <Checkbox checked={bordered} onChange={setBordered}>
          是否显示边框
        </Checkbox>
        {/* 高度变化代码保留；用于测试 Table 高度变化时，是否表现正常 */}
        {/* <Button onClick={setLowerHeight}>Lower Height</Button> */}
        {/* <Button onClick={setHigherHeight}>Higher Height</Button> */}
      </Space>

      <Table
        ref={tableRef}
        rowKey="id"
        data={data}
        columns={columns}
        bordered={bordered}
        height={height}
        scroll={{ type: 'virtual', rowHeight: 48, bufferSize: 10 }}
      ></Table>
    </Space>
  );
};

TableVirtualScroll.displayName = 'TableVirtualScroll';

export default TableVirtualScroll;
