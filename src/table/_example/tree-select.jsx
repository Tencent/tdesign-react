import React, { useState, useEffect } from 'react';
import { EnhancedTable, Radio } from 'tdesign-react';
import cloneDeep from 'lodash/cloneDeep';

const initData = [];
for (let i = 0; i < 5; i++) {
  const obj = {
    key: i,
    instance: `JQTest${i}`,
    status: i % 2,
    owner: i % 2 === 0 ? 'jenny' : 'peter',
    description: 'important.',
  };
  obj.childrenList = new Array(5).fill(null).map((t, j) => {
    const secondIndex = 100 * j + (i + 1) * 10;
    const secondObj = {
      ...obj,
      status: secondIndex % 3,
      key: secondIndex,
      instance: `JQTest${secondIndex}`,
    };
    secondObj.childrenList = new Array(5).fill(null).map((m, n) => {
      const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
      return {
        ...obj,
        status: thirdIndex % 3,
        key: thirdIndex,
        instance: `JQTest${thirdIndex}`,
      };
    });
    return secondObj;
  });
  initData.push(obj);
}
const columns = [
  {
    colKey: 'row-select',
    type: 'multiple',
    // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
    // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
    // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

    // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
    // 这种方式禁用行选中，行文本不会变灰
    checkProps: ({ row }) => ({ disabled: row.status !== 0 }),
    // 自由调整宽度，如果发现元素看不见，请加大宽度
    width: 20,
  },
  {
    colKey: 'instance',
    title: '集群名称',
    width: 250,
  },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    cell: ({ row }) => (row.status === 0 ? <p className="status">健康</p> : <p className="status unhealth">异常</p>),
  },
  { colKey: 'owner', title: '管理员' },
  { colKey: 'description', title: '描述' },
];


export default function TableSingleSort() {
  const [data] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkStrictly, setCheckStrictly] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(
    () => {
      selectedRowKeys.value = [];
      data.value = cloneDeep(data.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkStrictly.value]
  );

  function onSelectChange(value, selectOptions) {
    console.log('onSelectChange', value, selectOptions);
    setSelectedRowKeys(value);
  }

  const onExpandChange = (val) => {
    setExpandedRowKeys(val);
  };

  return (
    <div className="demo-table-tree-select">
      <Radio.Group value={checkStrictly} onChange={setCheckStrictly} variant="default-filled">
        <Radio.Button value={true}>父子行选中独立</Radio.Button>
        <Radio.Button value={false}>父子行选中关联</Radio.Button>
      </Radio.Group>

      <EnhancedTable
        rowKey="key"
        data={data}
        columns={columns}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        tree={{ checkStrictly, childrenKey: 'childrenList' }}
        expandedRow={({ row }) => <div>这是展开项数据，我是 {row.key} 号</div>}
        expandedRowKeys={expandedRowKeys}
        onExpandChange={onExpandChange}
      />
    </div>
  );
}
