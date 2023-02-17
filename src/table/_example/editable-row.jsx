import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Table, Input, Radio, Select, DatePicker, MessagePlugin, Button, Link } from 'tdesign-react';
import dayjs from 'dayjs';

const classStyles = `
<style>
.t-table-demo__editable-row .table-operations > .t-link {
  padding: 0 8px;
  line-height: 22px;
  height: 22px;
}
.t-table-demo__editable-row .t-demo-col__datepicker .t-date-picker {
  width: 120px;
}
</style>
`;

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['贾明', '张三', '王芳'][i % 3],
  status: i % 3,
  email: [
    'espinke0@apache.org',
    'gpurves1@issuu.com',
    'hkment2@nsw.gov.au',
    'lskures3@apache.org',
    'zcroson5@virginia.edu',
  ][i % 4],
  letters: [
    ['激励奖品快递费'],
    ['相关周边制作费', '激励奖品快递费'],
    ['相关周边制作费'],
    ['激励奖品快递费', '相关周边制作费'],
  ][i % 4],
  createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
}));

const STATUS_OPTIONS = [
  { label: '审批通过', value: 0 },
  { label: '审批过期', value: 1 },
  { label: '审批失败', value: 2 },
];

export default function EditableRowTable() {
  const tableRef = useRef(null);
  const [data, setData] = useState([...initData]);
  const [editableRowKeys, setEditableRowKeys] = useState(['1']);
  let currentSaveId = '';
  // 保存变化过的行信息
  const editMap = {};

  const [openCheckAll, setOpenCheckAll] = useState(false);

  const onEdit = (e) => {
    const { id } = e.currentTarget.dataset;
    if (!editableRowKeys.includes(id)) {
      setEditableRowKeys(editableRowKeys.concat(id));
    }
  };

  // 更新 editableRowKeys
  const updateEditState = (id) => {
    const index = editableRowKeys.findIndex((t) => t === id);
    editableRowKeys.splice(index, 1);
    setEditableRowKeys([...editableRowKeys]);
  };

  const onCancel = (e) => {
    const { id } = e.currentTarget.dataset;
    updateEditState(id);
    tableRef.current.clearValidateData();
  };

  const onSave = (e) => {
    const { id } = e.currentTarget.dataset;
    currentSaveId = id;
    // 触发内部校验，可异步接收校验结果，也可在 onRowValidate 中接收异步校验结果
    tableRef.current.validateRowData(id).then((params) => {
      console.log('Promise Row Validate:', params);
      if (params.result.length) {
        const r = params.result[0];
        MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
        return;
      }
      // 如果是 table 的父组件主动触发校验
      if (params.trigger === 'parent' && !params.result.length) {
        const current = editMap[currentSaveId];
        // 单行数据校验：校验通过再保存数据
        if (current) {
          data.splice(current.rowIndex, 1, current.editedRow);
          setData([...data]);
          MessagePlugin.success('保存成功');
        }
        updateEditState(currentSaveId);
      }
    });
  };

  const onRowValidate = (params) => {
    console.log('Event Row Validate:', params);
  };

  // 行数据编辑时触发，返回最新输入结果
  const onRowEdit = (params) => {
    const { row, rowIndex, col, value } = params;
    const oldRowData = editMap[row.key]?.editedRow || row;
    const editedRow = { ...oldRowData, [col.colKey]: value };
    editMap[row.key] = {
      ...params,
      editedRow,
    };

    // 以下内容应用于全量数据校验（单独的行校验不需要）
    if (openCheckAll) {
      data[rowIndex] = editedRow;
      setData(data);
    }
  };

  function onValidateTableData() {
    // 执行结束后触发事件 validate
    tableRef.current.validateTableData().then((params) => {
      console.log('Promise Table Date Validate:', params);
      const cellKeys = Object.keys(params.result);
      const firstError = params.result[cellKeys[0]];
      if (firstError) {
        MessagePlugin.warning(firstError[0].message);
      }
    });
  }

  // 表格全量数据校验反馈事件，tableRef.current.validateTableData() 执行结束后触发
  function onValidate(params) {
    console.log('Event Table Data Validate:', params);
  }

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const columns = useMemo(
    () => [
      {
        title: '申请人',
        colKey: 'firstName',
        align: 'left',
        width: 120,
        // 编辑状态相关配置，全部集中在 edit
        edit: {
          // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
          // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
          component: Input,
          // props, 透传全部属性到 Input 组件
          props: {
            clearable: true,
            autofocus: true,
            autoWidth: true,
          },
          // 校验规则，此处同 Form 表单
          rules: [
            { required: true, message: '不能为空' },
            { max: 10, message: '字符数量不能超过 10', type: 'warning' },
          ],
          showEditIcon: false,
        },
      },
      {
        title: '申请状态',
        colKey: 'status',
        cell: ({ row }) => STATUS_OPTIONS.find((t) => t.value === row.status)?.label,
        width: 150,
        edit: {
          component: Select,
          // props, 透传全部属性到 Select 组件
          props: {
            clearable: true,
            autoWidth: true,
            options: STATUS_OPTIONS,
          },
          showEditIcon: false,
          // 校验规则，此处同 Form 表单
          rules: [{ required: true, message: '不能为空' }],
        },
      },
      {
        title: '申请事项',
        colKey: 'letters',
        cell: ({ row }) => row?.letters?.join('、'),
        edit: {
          component: Select,
          // props, 透传全部属性到 Select 组件
          // props 为函数时，参数有：col, row, rowIndex, colIndex, editedRow。一般用于实现编辑组件之间的联动
          props: ({ editedRow }) => ({
            multiple: true,
            minCollapsedNum: 1,
            autoWidth: true,
            options: [
              { label: '宣传物料制作费用', value: '宣传物料制作费用' },
              { label: 'algolia 服务报销', value: 'algolia 服务报销' },
              // 如果状态选择了 已过期，则 Letters 隐藏 G 和 H
              { label: '相关周边制作费', value: '相关周边制作费', show: () => editedRow.status !== 0 },
              { label: '激励奖品快递费', value: '激励奖品快递费', show: () => editedRow.status !== 0 },
            ].filter((t) => (t.show === undefined ? true : t.show())),
          }),
          showEditIcon: false,
          // 校验规则，此处同 Form 表单
          rules: [{ validator: (val) => val && val.length < 3, message: '数量不能超过 2 个' }],
        },
      },
      {
        title: '创建日期',
        colKey: 'createTime',
        width: 150,
        className: 't-demo-col__datepicker',
        // props, 透传全部属性到 DatePicker 组件
        edit: {
          component: DatePicker,
          showEditIcon: false,
          // 校验规则，此处同 Form 表单
          rules: [
            {
              validator: (val) => dayjs(val).isAfter(dayjs()),
              message: '只能选择今天以后日期',
            },
          ],
        },
      },
      {
        title: '操作栏',
        colKey: 'operate',
        width: 150,
        cell: ({ row }) => {
          const editable = editableRowKeys.includes(row.key);
          return (
            <div className="table-operations">
              {!editable && (
                <Link theme="primary" hover="color" data-id={row.key} onClick={onEdit}>
                  编辑
                </Link>
              )}
              {editable && (
                <Link theme="primary" hover="color" data-id={row.key} onClick={onSave}>
                  保存
                </Link>
              )}
              {editable && (
                <Link theme="primary" hover="color" data-id={row.key} onClick={onCancel}>
                  取消
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, editableRowKeys],
  );

  // 当前示例包含：输入框、单选、多选、日期 等场景
  return (
    <div className="t-table-demo__editable-row">
      <div>
        <Radio.Group value={openCheckAll} onChange={setOpenCheckAll}>
          <Radio.Button value={true}>全量校验</Radio.Button>
          <Radio.Button value={false}>单行校验</Radio.Button>
        </Radio.Group>
      </div>
      <br />
      {openCheckAll && (
        <div>
          <Button onClick={onValidateTableData}>校验全部</Button>
        </div>
      )}

      <br />
      <Table
        ref={tableRef}
        rowKey="key"
        columns={columns}
        data={data}
        editableRowKeys={editableRowKeys}
        onRowEdit={onRowEdit}
        onRowValidate={onRowValidate}
        onValidate={onValidate}
        table-layout="auto"
        bordered
      />
    </div>
  );
}

EditableRowTable.displayName = 'EditableRowTable';
