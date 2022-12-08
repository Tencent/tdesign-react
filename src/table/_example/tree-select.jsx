import React, { useState, useEffect, useRef } from 'react';
import { EnhancedTable, Radio, Space, Button, MessagePlugin, Tag } from 'tdesign-react';
import cloneDeep from 'lodash/cloneDeep';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const CHILDREN_KEY = 'childrenList';

const initData = [];
for (let i = 0; i < 5; i++) {
  const obj = {
    key: i,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  };
  obj.childrenList = new Array(5).fill(null).map((t, j) => {
    const secondIndex = 100 * j + (i + 1) * 10;
    const secondObj = {
      ...obj,
      status: secondIndex % 3,
      key: secondIndex,
      applicant: ['贾明', '张三', '王芳'][secondIndex % 3],
    };
    secondObj.childrenList = new Array(3).fill(null).map((m, n) => {
      const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
      return {
        ...obj,
        status: thirdIndex % 3,
        key: thirdIndex,
        applicant: ['贾明', '张三', '王芳'][thirdIndex % 3],
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
    checkProps: ({ row }) => ({ disabled: !row.childrenList && row.status !== 0 }),
    // 自由调整宽度，如果发现元素看不见，请加大宽度
    width: 50,
  },
  { colKey: 'applicant', title: '申请人', width: 120 },
  {
    colKey: 'status',
    title: '状态',
    width: 144,
    cell: ({ row }) => (
      <Tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
        {statusNameListMap[row.status].icon}
        {statusNameListMap[row.status].label}
      </Tag>
    ),
  },
  { colKey: 'matters', title: '申请事项', width: '150' },
  { colKey: 'email', title: '邮箱地址' },
];

export default function TableSingleSort() {
  const [data, setData] = useState([...initData]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [checkStrictly, setCheckStrictly] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const treeTableRef = useRef(null);

  useEffect(() => {
    // 包含 treeDataMap 及各类树形操作方法
    console.log(treeTableRef.current);
  }, []);

  useEffect(
    () => {
      setSelectedRowKeys([]);
      setData(cloneDeep(data));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkStrictly],
  );

  // 可使用 treeTableRef.current.treeDataMap 判断是否为叶子结点，或任意结点的层级
  function onSelectChange(value, selectOptions) {
    console.log('onSelectChange', value, selectOptions);
    setSelectedRowKeys(value);
  }

  const onExpandChange = (val) => {
    setExpandedRowKeys(val);
  };

  const getTreeExpandedRow = () => {
    const treeExpandedRowKeys = treeTableRef.current.getTreeExpandedRow('unique');
    console.log('行唯一标识值：', treeExpandedRowKeys);

    const treeExpandedRow = treeTableRef.current.getTreeExpandedRow('data');
    console.log('行数据：', treeExpandedRow);

    const treeExpandedRowState = treeTableRef.current.getTreeExpandedRow('all');
    console.log('全部行信息：', treeExpandedRowState);

    MessagePlugin.success('获取成功，请打开控制台查看');
  };

  return (
    <Space direction="vertical">
      <Space>
        <Radio.Group value={checkStrictly} onChange={setCheckStrictly} variant="default-filled">
          <Radio.Button value={true}>父子行选中独立</Radio.Button>
          <Radio.Button value={false}>父子行选中关联</Radio.Button>
        </Radio.Group>
        <Button onClick={getTreeExpandedRow}>获取树形结构展开的节点</Button>
      </Space>

      <EnhancedTable
        ref={treeTableRef}
        rowKey="key"
        data={data}
        columns={columns}
        // indeterminateSelectedRowKeys={[1]}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={onSelectChange}
        tree={{ checkStrictly, childrenKey: CHILDREN_KEY }}
        expandedRow={({ row }) => <div>这是展开项数据，我是 {row.key} 号</div>}
        expandedRowKeys={expandedRowKeys}
        onExpandChange={onExpandChange}
      />
    </Space>
  );
}
