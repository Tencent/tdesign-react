import React from 'react';
import { Table } from 'tdesign-react';
import { LoadingIcon } from 'tdesign-icons-react';

export default function EmptyTable() {
  const columns = [
    { colKey: 'instance', title: '集群名称' },
    { colKey: 'status', title: '状态' },
    { colKey: 'owner', title: '管理员' },
    { colKey: 'description', title: '描述' },
  ];
  return (
    <div>
      <Table data={[]} columns={columns} rowKey="id" loading={true}></Table>

      <Table data={[]} columns={columns} rowKey="id" loading={'自定义加载状态文本'}></Table>

      <Table
        data={[]}
        columns={columns}
        rowKey="id"
        loadingProps={{ indicator: false }}
        loading={
          <div>
            <LoadingIcon name="loading" size="20px" />
            &nbsp;&nbsp;<span>渲染函数自定义加载中（可单独去除内置加载图标）</span>
          </div>
        }
      ></Table>
    </div>
  );
}
