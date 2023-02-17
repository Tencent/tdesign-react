import React, { useState } from 'react';
import { Table, Button, Space, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

export default function TableCustomCol() {
  const initialData = [];
  for (let i = 0; i < 100; i++) {
    initialData.push({
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

  const [data] = useState([...initialData]);

  const staticColumn = ['applicant', 'status'];
  const [displayColumns, setDisplayColumns] = useState(staticColumn.concat(['channel', 'detail.email', 'createTime']));

  const [columnControllerVisible, setColumnControllerVisible] = useState(false);

  const columns = [
    { colKey: 'applicant', title: '申请人', width: '100' },
    {
      colKey: 'status',
      title: '申请状态',
      width: '150',
      cell: ({ row }) => {
        const statusNameListMap = {
          0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
          1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
          2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
        };

        return (
          <Tag
            shape="round"
            theme={statusNameListMap[row.status].theme}
            variant="light-outline"
            icon={statusNameListMap[row.status].icon}
          >
            {statusNameListMap[row.status].label}
          </Tag>
        );
      },
    },
    { colKey: 'channel', title: '签署方式', width: '120' },
    { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
    { colKey: 'createTime', title: '申请时间' },
  ];

  const onColumnChange = (params) => {
    console.log(params);
  };

  return (
    <Space direction="vertical" size="large">
      <Button onClick={() => setColumnControllerVisible(true)}>显示列配置弹窗</Button>
      <Table
        displayColumns={displayColumns}
        onDisplayColumnsChange={setDisplayColumns}
        columnControllerVisible={columnControllerVisible}
        onColumnControllerVisibleChange={setColumnControllerVisible}
        rowKey="index"
        data={data}
        columns={columns}
        columnController={{
          fields: ['channel', 'detail.email', 'createTime'],
          dialogProps: { preventScrollThrough: true },
          hideTriggerButton: true,
        }}
        pagination={{ defaultPageSize: 5, defaultCurrent: 1, total: 100 }}
        tableLayout="auto"
        stripe
        onColumnChange={onColumnChange}
      ></Table>
    </Space>
  );
}
