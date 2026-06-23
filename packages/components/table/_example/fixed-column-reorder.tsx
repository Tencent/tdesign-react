import React, { useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Radio, Space, Table, Tag } from 'tdesign-react';

import type { PrimaryTableCol, TableProps } from 'tdesign-react';

const data: TableProps['data'] = [];
for (let i = 0; i < 10; i++) {
  data.push({
    id: i + 1,
    name: ['张三', '李四', '王芳'][i % 3],
    email: ['a@example.com', 'b@example.com', 'c@example.com'][i % 3],
    dept: ['研发', '设计', '产品'][i % 3],
    city: ['深圳', '上海', '北京'][i % 3],
    address: ['南山区科技园', '浦东新区陆家嘴', '朝阳区望京'][i % 3],
    remark: ['备注 A', '备注 B', '备注 C'][i % 3],
  });
}

/** 固定列目标：name 为第二列数据，用于验证非首列左吸 */
type FixedTarget = 'none' | 'name' | 'dept';

export default function TableFixedColumnReorder() {
  const tableRef = useRef(null);
  const [fixedColumnReorder, setFixedColumnReorder] = useState(true);
  const [fixedTarget, setFixedTarget] = useState<FixedTarget>('name');
  const [showRowSelect, setShowRowSelect] = useState(false);

  const baseColumns: PrimaryTableCol[] = useMemo(
    () => [
      { colKey: 'id', title: 'ID（定义第 1 列）', width: 100 },
      { colKey: 'name', title: '姓名（定义第 2 列）', width: 120 },
      { colKey: 'email', title: '邮箱', width: 180 },
      { colKey: 'dept', title: '部门（定义第 4 列）', width: 120 },
      { colKey: 'city', title: '城市', width: 120 },
      { colKey: 'address', title: '地址', width: 220 },
      { colKey: 'remark', title: '备注', width: 160 },
      {
        colKey: 'operation',
        title: '操作',
        width: 100,
        fixed: 'right',
        cell: () => (
          <Button theme="primary" variant="text">
            查看
          </Button>
        ),
      },
    ],
    [],
  );

  const columns = useMemo(() => {
    const cols = baseColumns.map((col) => {
      if (fixedTarget !== 'none' && col.colKey === fixedTarget) {
        return { ...col, fixed: 'left' as const };
      }
      return col;
    });

    if (showRowSelect) {
      return [{ colKey: 'row-select', type: 'multiple', width: 46 }, ...cols];
    }
    return cols;
  }, [baseColumns, fixedTarget, showRowSelect]);

  const renderOrderHint = useMemo(() => {
    const defineOrder = columns.map((col) => col.colKey).join(' → ');
    let expectRender = defineOrder;
    if (fixedColumnReorder && fixedTarget === 'name') {
      expectRender = showRowSelect ? 'row-select → name → id → email → dept → ...' : 'name → id → email → dept → ...';
    } else if (fixedColumnReorder && fixedTarget === 'dept') {
      expectRender = showRowSelect ? 'row-select → dept → id → name → ...' : 'dept → id → name → email → ...';
    }
    return { defineOrder, expectRender };
  }, [columns, fixedColumnReorder, fixedTarget, showRowSelect]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space breakLine>
        <Checkbox checked={fixedColumnReorder} onChange={setFixedColumnReorder}>
          fixedColumnReorder（左固定列前置重排）
        </Checkbox>
        <Checkbox checked={showRowSelect} onChange={setShowRowSelect}>
          显示多选列
        </Checkbox>
      </Space>

      <Radio.Group value={fixedTarget} variant="default-filled" onChange={(val: FixedTarget) => setFixedTarget(val)}>
        <Radio.Button value="none">不固定</Radio.Button>
        <Radio.Button value="name">固定 name（第 2 列）</Radio.Button>
        <Radio.Button value="dept">固定 dept（第 4 列）</Radio.Button>
      </Radio.Group>

      <Space>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('id')}>
          滚动到 ID 列
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('email')}>
          滚动到邮箱列
        </Button>
      </Space>

      <Space direction="vertical" size={4}>
        <Tag theme="default" variant="light">
          columns 定义顺序：{renderOrderHint.defineOrder}
        </Tag>
        <Tag theme="primary" variant="light">
          {fixedColumnReorder ? '开启重排后预期渲染顺序' : '关闭重排（sticky 原序）'}：{renderOrderHint.expectRender}
        </Tag>
        <span style={{ color: 'var(--td-text-color-secondary)', fontSize: 12 }}>
          对比方式：固定 name 后切换 fixedColumnReorder 开关，观察初始是否「姓名贴左、ID 在右侧可滚」。
        </span>
      </Space>

      <Table
        ref={tableRef}
        bordered
        rowKey="id"
        data={data}
        maxHeight={320}
        fixedColumnReorder={fixedColumnReorder}
        columns={columns}
      />
    </Space>
  );
}
