import React, { useState } from 'react';
import { Table, Radio, Checkbox, Space, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

export default function TableCustomColButton() {
  const [placement, setPlacement] = useState('top-right');
  const [bordered, setBordered] = useState(true);
  const [customText, setCustomText] = useState(false);

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

  const tableNode = (
    <Table
      // defaultDisplayColumns={displayColumns}
      displayColumns={displayColumns}
      onDisplayColumnsChange={setDisplayColumns}
      rowKey="index"
      data={data}
      columns={columns}
      columnController={{
        placement,
        fields: ['channel', 'detail.email', 'createTime'],
        dialogProps: { preventScrollThrough: true },
        buttonProps: customText ? { content: '显示列控制', theme: 'primary', variant: 'base' } : undefined,
      }}
      pagination={{ defaultPageSize: 5, defaultCurrent: 1, total: 100 }}
      bordered={bordered}
      tableLayout="auto"
      stripe
      onColumnChange={onColumnChange}
    ></Table>
  );

  return (
    <Space direction="vertical" size="large">
      <Radio.Group value={placement} onChange={setPlacement} variant="default-filled">
        <Radio.Button value="top-left">左上角</Radio.Button>
        <Radio.Button value="top-right">右上角</Radio.Button>
        <Radio.Button value="bottom-left">左下角</Radio.Button>
        <Radio.Button value="bottom-right">右下角</Radio.Button>
      </Radio.Group>
      <Space direction="horizontal" align="center">
        <Checkbox checked={bordered} onChange={setBordered}>
          是否显示边框
        </Checkbox>
        <Checkbox checked={customText} onChange={setCustomText}>
          自定义列配置按钮
        </Checkbox>
      </Space>

      {tableNode}
    </Space>
  );
}
