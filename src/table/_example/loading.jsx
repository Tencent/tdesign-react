import React from 'react';
import { Table, Icon } from '@tencent/tdesign-react';

export default function EmptyTable() {
  const data = [];
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
  return (
    <div>
      <div style={{ marginTop: '20px' }}>默认加载状态</div>
      <Table data={data} columns={columns} rowKey="id" loading={true}></Table>

      <div style={{ marginTop: '20px' }}>渲染函数定义加载状态</div>
      <Table
        data={data}
        columns={columns}
        rowKey="id"
        loading={
          <div style={{ marginTop: 100 }}>
            <Icon name="loading" size="35px" />
          </div>
        }
      ></Table>
    </div>
  );
}
