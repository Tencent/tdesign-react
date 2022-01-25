import React from 'react';
import { EnhancedTable } from 'tdesign-react';

function getData(currentPage = 1) {
  const data = [];
  const pageInfo = `第 ${currentPage} 页`;
  for (let i = 0; i < 6; i++) {
    const obj = {
      key: `我是 ${i} 号（${pageInfo}）`,
      platform: i % 2 === 0 ? '共有' : '私有',
      type: ['String', 'Number', 'Array', 'Object'][i % 4],
      default: ['-', '0', '[]', '{}'][i % 4],
      detail: {
        postion: `读取 ${i} 个数据的嵌套信息值`,
      },
      needed: i % 4 === 0 ? '是' : '否',
      description: '数据源',
    };
    obj.list = new Array(2).fill(null).map((t, j) => {
      const secondIndex = 100 * j + (i + 1) * 10;
      const secondObj = {
        ...obj,
        key: `我是 ${secondIndex} 号（${pageInfo}）`,
      };
      secondObj.list = new Array(3).fill(null).map((m, n) => ({
        ...obj,
        key: `我是 ${secondIndex * 1000 + 100 * m + (n + 1) * 10} 号（${pageInfo}）`,
      }));
      return secondObj;
    });
    data.push(obj);
  }
  return data;
}
const data = getData();

const columns = [
  {
    width: 200,
    className: 'row',
    colKey: 'key',
    title: '编号',
    ellipsis: true,
  },
  {
    colKey: 'platform',
    title: '平台',
  },
  {
    colKey: 'type',
    title: '类型',
  },
];

export default function TableBasic() {
  return (
    <EnhancedTable
      data={data}
      columns={columns}
      rowKey="key"
      tree={{ childrenKey: 'list' }}
      pagination={{ defaultPageSize: 5, defaultCurrent: 1, total: data.length }}
    />
  );
}
