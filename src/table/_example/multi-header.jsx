import React, { useState } from 'react';
import { Table, Checkbox, Space, Tag } from 'tdesign-react';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

const statusNameListMap = {
  0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
  1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
  2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
};

const initialData = [];
for (let i = 0; i < 20; i++) {
  initialData.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    time: [3, 2, 4, 1][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
    property: ['组长审批', '部门审批', '财务审批'][i % 3],
    default: i,
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    type_default: '-',
    description: '数据源',
    field1: [100, 200, 400, 500][i % 4],
    field2: [100, 200, 400, 500][i % 4],
    field3: [100, 200, 400, 500][i % 4],
    field4: [100, 200, 400, 500][i % 4],
    field5: '字段5',
    field6: '字段6',
    field7: `审批单号00${i + 1}`,
  });
}

export default function TableExample() {
  const [data, setData] = useState([...initialData]);
  const [bordered, setBordered] = useState(true);
  const [fixedHeader, setFixedHeader] = useState(true);
  const [fixedLeftCol, setFixedLeftCol] = useState(false);
  const [fixedRightCol, setFixedRightCol] = useState(false);
  const [headerAffixedTop, setHeaderAffixedTop] = useState(false);
  const [sort, setSort] = useState({ sortBy: 'default', descending: false });

  const onSortChange = (sortInfo, context) => {
    setSort(sortInfo);
    setData([...context.currentDataSource]);
    console.log(context);
  };

  const columns = [
    {
      title: '申请人',
      colKey: 'applicant',
      fixed: fixedLeftCol && 'left',
      width: 100,
    },
    {
      title: '申请汇总',
      fixed: fixedLeftCol && 'left',
      width: 100,
      colKey: 'total_info',
      children: [
        {
          align: 'left',
          colKey: 'platform',
          title: '申请状态',
          fixed: fixedLeftCol && 'left',
          width: 120,
          sorter: (a, b) => a.default - b.default,
          cell: ({ rowIndex }) => {
            const status = rowIndex % 3;
            return (
              <Tag
                shape="round"
                theme={statusNameListMap[status].theme}
                variant="light-outline"
                icon={statusNameListMap[status].icon}
              >
                {statusNameListMap[status].label}
              </Tag>
            );
          },
        },
        {
          title: '申请渠道和金额',
          colKey: 'type_default',
          fixed: fixedLeftCol && 'left',
          width: 100,
          children: [
            {
              align: 'left',
              colKey: 'channel',
              title: '类型',
              fixed: fixedLeftCol && 'left',
              width: 110,
            },
            {
              align: 'center',
              colKey: 'time',
              title: '申请耗时(天)',
              fixed: fixedLeftCol && 'left',
              width: 150,
            },
          ],
        },
      ],
    },
    {
      colKey: 'field1',
      title: '住宿费',
      width: 100,
    },
    {
      colKey: 'field3',
      title: '交通费',
      width: 100,
    },
    {
      colKey: 'field4',
      title: '物料费',
      width: 100,
    },
    {
      colKey: 'field2',
      title: '奖品激励费',
      width: 120,
    },
    {
      title: '审批汇总',
      colKey: 'instruction',
      fixed: fixedRightCol && 'right',
      width: 100,
      children: [
        {
          align: 'left',
          colKey: 'property',
          title: '审批状态',
          fixed: fixedRightCol && 'right',
          width: 120,
          filter: {
            type: 'single',
            list: [
              { label: '所有状态', value: '' },
              { label: '组长审批', value: '组长审批' },
              { label: '部门审批', value: '部门审批' },
              { label: '财务审批', value: '财务审批' },
            ],
          },
        },
        {
          align: 'left',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
          fixed: fixedRightCol && 'right',
          width: 100,
          children: [
            {
              colKey: 'field7',
              title: '审批单号',
              fixed: fixedRightCol && 'right',
              width: 120,
            },
            {
              colKey: 'detail.email',
              title: '邮箱地址',
              fixed: fixedRightCol && 'right',
              ellipsis: true,
              width: 150,
            },
          ],
        },
      ],
    },
    {
      colKey: 'createTime',
      title: '申请时间',
      fixed: fixedRightCol && 'right',
      width: '120',
    },
  ];
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* <!-- 按钮操作区域 --> */}
      <Space>
        <Checkbox checked={bordered} onChange={setBordered}>
          显示表格边框
        </Checkbox>
        <Checkbox checked={fixedHeader} onChange={setFixedHeader}>
          显示固定表头
        </Checkbox>
        <Checkbox checked={fixedLeftCol} onChange={setFixedLeftCol}>
          固定左侧列
        </Checkbox>
        <Checkbox checked={fixedRightCol} onChange={setFixedRightCol}>
          固定右侧列
        </Checkbox>
        <Checkbox checked={headerAffixedTop} onChange={setHeaderAffixedTop}>
          表头吸顶
        </Checkbox>
      </Space>

      <Table
        data={data}
        bordered={bordered}
        columns={columns}
        rowKey="index"
        maxHeight={fixedHeader ? 380 : undefined}
        headerAffixProps={{ offsetTop: 0 }}
        headerAffixedTop={headerAffixedTop}
        columnController={{ displayType: 'auto-width' }}
        sort={sort}
        onSortChange={onSortChange}
      />
    </Space>
  );
}
