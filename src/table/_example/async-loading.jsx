import React, { useMemo, useState } from 'react';
import { Table, Radio } from 'tdesign-react';

const data = [
  {
    id: 'demo1',
    instance: 'JQTest1',
    status: 0,
    owner: 'jenny;peter',
    description: 'test1',
  },
  {
    id: 'demo2',
    instance: 'JQTest2',
    status: 1,
    owner: 'jenny',
    description: 'test2',
  },
  {
    id: 'demo3',
    instance: 'JQTest3',
    status: 0,
    owner: 'jenny',
    description: 'test3',
  },
  {
    id: 'demo4',
    instance: 'JQTest4',
    status: 1,
    owner: 'peter',
    description: 'test4',
  },
  {
    id: 'demo5',
    instance: 'JQTest5',
    status: 1,
    owner: 'peter',
    description: 'test5',
  },
];
const columns = [
  { colKey: 'instance', title: '集群名称', width: 200, className: 'instance' },
  {
    colKey: 'status',
    title: '状态',
    width: 200,
    cell({ row }) {
      switch (row.status) {
        case 0:
          return <p className="status">健康</p>;
        case 1:
          return <p className="status warning">警告</p>;
        case 2:
          return <p className="status unhealth">异常</p>;
        default:
          return null;
      }
    },
  },
  { colKey: 'owner', title: '管理员', width: 200 },
  {
    colKey: 'description',
    title: '描述',
  },
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
        rowKey="id"
        asyncLoading={loadingNode}
        onAsyncLoadingClick={onAsyncLoadingClick}
      ></Table>
    </div>
  );
}
