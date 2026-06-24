import React, { useMemo, useRef, useState } from 'react';
import { Button, Checkbox, Radio, Space, Table, Tag } from 'tdesign-react';

import { getLeftFixedReorderTriggerEntries, hasLeftFixedColumnNeedReorder } from '../utils/reorderFixedColumns';

import type { PrimaryTableRef } from '../interface';
import type { PrimaryTableCol, TableRowData } from '../type';

const data: TableRowData[] = [];
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

/** 固定列场景：单非首列 / 相连两列 / 不相连两列 */
type FixedTarget = 'none' | 'name' | 'dept' | 'connected' | 'disconnected';

/** 根据场景为列打上 fixed: 'left' */
function applyFixedTarget(cols: PrimaryTableCol[], fixedTarget: FixedTarget): PrimaryTableCol[] {
  const leftFixedKeys = new Set<string>();
  if (fixedTarget === 'name') leftFixedKeys.add('name');
  if (fixedTarget === 'dept') leftFixedKeys.add('dept');
  // 相连：id + name 从左连续 fixed
  if (fixedTarget === 'connected') {
    leftFixedKeys.add('id');
    leftFixedKeys.add('name');
  }
  // 不相连：name + dept，中间夹 email
  if (fixedTarget === 'disconnected') {
    leftFixedKeys.add('name');
    leftFixedKeys.add('dept');
  }

  return cols.map((col) => {
    if (leftFixedKeys.has(String(col.colKey))) {
      return { ...col, fixed: 'left' as const };
    }
    if (col.fixed === 'left') {
      const nextCol = { ...col };
      delete nextCol.fixed;
      return nextCol;
    }
    return col;
  });
}

export default function TableFixedColumnReorder() {
  const tableRef = useRef<PrimaryTableRef>(null);
  const [fixedTarget, setFixedTarget] = useState<FixedTarget>('none');
  const [showRowSelect, setShowRowSelect] = useState(false);

  const baseColumns: PrimaryTableCol[] = useMemo(
    () => [
      { colKey: 'id', title: 'ID（定义第 1 列）', width: 100 },
      { colKey: 'name', title: '姓名（定义第 2 列）', width: 120 },
      { colKey: 'email', title: '邮箱（定义第 3 列）', width: 180 },
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
    const cols = applyFixedTarget(baseColumns, fixedTarget);
    if (showRowSelect) {
      const rowSelectCol: PrimaryTableCol = {
        colKey: 'row-select',
        type: 'multiple',
        width: 46,
      };
      return [rowSelectCol, ...cols];
    }
    return cols;
  }, [baseColumns, fixedTarget, showRowSelect]);

  const willReorder = hasLeftFixedColumnNeedReorder(columns);

  const renderOrderHint = useMemo(() => {
    const defineOrder = columns.map((col) => col.colKey).join(' → ');
    const colWidths = Object.fromEntries(
      baseColumns.filter((col) => col.colKey).map((col) => [col.colKey, col.width as number]),
    );
    const triggerEntries = getLeftFixedReorderTriggerEntries(columns, colWidths);
    const leadingPrefix = showRowSelect ? 'row-select → ' : '';

    const stageHints: { label: string; order: string }[] = [];
    if (willReorder && fixedTarget === 'name') {
      stageHints.push({
        label: `name 贴左（scrollLeft ≥ ${triggerEntries[0]?.threshold ?? 0}px）`,
        order: `${leadingPrefix}name → id → email → dept → ...`,
      });
    } else if (willReorder && fixedTarget === 'dept') {
      stageHints.push({
        label: `dept 贴左（scrollLeft ≥ ${triggerEntries[0]?.threshold ?? 0}px）`,
        order: `${leadingPrefix}dept → id → name → email → ...`,
      });
    } else if (fixedTarget === 'disconnected') {
      triggerEntries.forEach((entry) => {
        if (entry.colKey === 'name') {
          stageHints.push({
            label: `name 贴左（scrollLeft ≥ ${entry.threshold}px）`,
            order: `${leadingPrefix}name → id → email → dept → city → ...`,
          });
        }
        if (entry.colKey === 'dept') {
          const nameOnlyOrder = `${leadingPrefix}name → id → email → dept → city → ...`;
          const deptBorderScrollLeft = entry.threshold - (colWidths.name ?? 120);
          stageHints.push({
            label: `dept border（sticky 贴住 name，scrollLeft ≥ ${deptBorderScrollLeft}px，此时尚未重排列序）`,
            order: nameOnlyOrder,
          });
          stageHints.push({
            label: `dept 重排前置（scrollLeft ≥ ${entry.threshold}px）`,
            order: `${leadingPrefix}name → dept → id → email → city → ...`,
          });
        }
      });
    }

    return { defineOrder, stageHints };
  }, [columns, willReorder, fixedTarget, showRowSelect, baseColumns]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Checkbox checked={showRowSelect} onChange={setShowRowSelect}>
        显示多选列
      </Checkbox>

      <Radio.Group value={fixedTarget} variant="default-filled" onChange={(val: FixedTarget) => setFixedTarget(val)}>
        <Radio.Button value="none">不固定（默认列序）</Radio.Button>
        <Radio.Button value="name">固定 name（第 2 列）</Radio.Button>
        <Radio.Button value="dept">固定 dept（第 4 列）</Radio.Button>
        <Radio.Button value="connected">相连两列 fixed（id + name）</Radio.Button>
        <Radio.Button value="disconnected">不相连两列 fixed（name + dept）</Radio.Button>
      </Radio.Group>

      <Space>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('id')}>
          滚动到 ID 列
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('email')}>
          滚动到邮箱列
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('dept')}>
          滚动到部门列
        </Button>
      </Space>

      <Space direction="vertical" size={4}>
        <Tag theme="default" variant="light">
          columns 定义顺序：{renderOrderHint.defineOrder}
        </Tag>
        <Tag theme="primary" variant="light">
          scrollLeft=0 时渲染顺序：{renderOrderHint.defineOrder}
        </Tag>
        {fixedTarget === 'connected' && (
          <>
            <Tag theme="success" variant="light">
              相连 fixed（id + name）：从左连续左固定，不触发内置重排，列序始终与定义一致
            </Tag>
            <Tag theme="default" variant="outline">
              标准 sticky：id 贴 left:0，name 贴 id 右侧；滚动仅显示左阴影，无分阶段前置
            </Tag>
          </>
        )}
        {renderOrderHint.stageHints.map((stage) => (
          <Tag key={stage.label} theme="warning" variant="light">
            {stage.label}：{stage.order}
          </Tag>
        ))}
        {fixedTarget === 'disconnected' && (
          <Tag theme="default" variant="outline">
            不相连 fixed：列重排与 border 分开检测——dept sticky 贴 name 时即显示 border，重排列序仍按各自阈值
          </Tag>
        )}
        <span style={{ color: 'var(--td-text-color-secondary)', fontSize: 12 }}>
          切换 fixed 目标会立即更新 fixed 边界；滚回贴左阈值以下或选「不固定」时 border 同步还原。
        </span>
      </Space>

      <Table ref={tableRef} bordered rowKey="id" data={data} maxHeight={320} style={{ width: 720 }} columns={columns} />
    </Space>
  );
}
