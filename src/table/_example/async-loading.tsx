import React, { useMemo, useState } from 'react';
import { Table, Radio, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
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
  });
}

const columns = [
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
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
  { colKey: 'channel', title: '签署方式', width: '120' },
  { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
  { colKey: 'createTime', title: '申请时间' },
];

export default function EmptyTable() {
  const [asyncLoading, setAsyncLoading] = useState('loading');

  const loadingNode = useMemo(
    () =>
      asyncLoading === 'loading-custom' ? (
        <>
          <div className={`t-table--loading-progressbar`} style={{ width: '50%' }} />
          <div className="t-table__async-loading">这是自定义加载状态和内容</div>
        </>
      ) : (
        asyncLoading
      ),
    [asyncLoading],
  );

  function onAsyncLoadingClick({ status }) {
    console.log('status', status);
    if (status === 'load-more') {
      setAsyncLoading('loading');
    }
  }

  return (
    <div>
      <Radio.Group value={asyncLoading} onChange={setAsyncLoading}>
        <Radio.Button value="load-more">加载更多</Radio.Button>
        <Radio.Button value="loading">加载中</Radio.Button>
        <Radio.Button value="loading-custom">自定义加载更多</Radio.Button>
        <Radio.Button value="">加载完成</Radio.Button>
      </Radio.Group>

      <Table
        data={data}
        columns={columns}
        rowKey="index"
        asyncLoading={loadingNode}
        onAsyncLoadingClick={onAsyncLoadingClick}
      ></Table>
    </div>
  );
}
