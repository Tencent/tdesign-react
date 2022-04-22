import React from 'react';
import { Table } from 'tdesign-react';

const data = [];
const total = 60;
for (let i = 0; i < total; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}

const columns = [
  {
    align: 'center',
    width: '100',
    className: 'row',
    colKey: 'index',
    title: '序号',
  },
  {
    width: 100,
    colKey: 'platform',
    title: '平台',
  },
  {
    colKey: 'type',
    title: '类型',
  },
  {
    colKey: 'default',
    title: '默认值',
  },
  {
    colKey: 'needed',
    title: '是否必传',
  },
  {
    colKey: 'detail.position',
    title: '详情信息',
    width: 200,
    ellipsis: true,
  },
];

export default function TableBasic() {
  // const [current, setCurrent] = useState(1);
  // const [pageSize, setPageSize] = useState(10);

  return (
    <Table
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
    />
  );
}
