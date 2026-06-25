import React, { useMemo, useRef, useState } from 'react';
import { Button, Radio, Space, Table, Tag } from 'tdesign-react';

import type { PrimaryTableRef } from '../interface';
import type { PrimaryTableCol, TableRowData } from '../type';

const TABLE_CLIENT_WIDTH = 720;

/** 固定列场景：左 / 右 对称的内置重排演示 */
type FixedTarget =
  | 'none'
  | 'name'
  | 'dept'
  | 'connected'
  | 'disconnected'
  | 'rightAddress'
  | 'rightDisconnected'
  | 'rightConnected';

type StageHint = { label: string; order: string };

function getStageHints(fixedTarget: FixedTarget): StageHint[] {
  switch (fixedTarget) {
    case 'name':
      return [
        {
          label: 'name 贴左（scrollLeft ≥ 100px）',
          order: 'name → id → email → dept → ...',
        },
      ];
    case 'disconnected':
      return [
        {
          label: 'name 贴左（scrollLeft ≥ 100px）',
          order: 'name → id → email → dept → city → ...',
        },
        {
          label: 'dept 重排前置（scrollLeft ≥ 400px）',
          order: 'name → dept → id → email → city → ...',
        },
      ];
    case 'rightAddress':
      return [
        {
          label: 'address 贴右（scrollLeft ≥ 140px）',
          order: '... → address → remark → operation',
        },
      ];
    case 'rightDisconnected':
      return [
        {
          label: '定义结构（镜像左不相连）',
          order: 'address(fixed) → city → remark(fixed) → email → operation',
        },
        {
          label: 'remark 贴右后置（scrollLeft ≥ 120px）',
          order: '... → remark → operation',
        },
      ];
    default:
      return [];
  }
}

function needsReorderHint(fixedTarget: FixedTarget): boolean {
  return ['name', 'dept', 'disconnected', 'rightAddress', 'rightDisconnected'].includes(fixedTarget);
}

function needsRightReorderHint(fixedTarget: FixedTarget): boolean {
  return fixedTarget === 'rightAddress' || fixedTarget === 'rightDisconnected';
}

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

/** 根据场景为列设置 fixed，并在右不相连时重排列序（镜像左：name—email—dept） */
function applyFixedTarget(cols: PrimaryTableCol[], fixedTarget: FixedTarget): PrimaryTableCol[] {
  const leftFixedKeys = new Set<string>();
  const rightFixedKeys = new Set<string>();

  if (fixedTarget === 'name') leftFixedKeys.add('name');
  if (fixedTarget === 'dept') leftFixedKeys.add('dept');
  if (fixedTarget === 'connected') {
    leftFixedKeys.add('id');
    leftFixedKeys.add('name');
  }
  if (fixedTarget === 'disconnected') {
    leftFixedKeys.add('name');
    leftFixedKeys.add('dept');
  }
  if (fixedTarget === 'rightAddress') rightFixedKeys.add('address');
  if (fixedTarget === 'rightDisconnected') {
    rightFixedKeys.add('address');
    rightFixedKeys.add('remark');
  }
  if (fixedTarget === 'rightConnected') {
    rightFixedKeys.add('remark');
    rightFixedKeys.add('operation');
  }

  const colMap = Object.fromEntries(cols.map((col) => [String(col.colKey), col]));

  const attachFixed = (col: PrimaryTableCol): PrimaryTableCol => {
    const key = String(col.colKey);
    if (leftFixedKeys.has(key)) return { ...col, fixed: 'left' as const };
    if (rightFixedKeys.has(key)) return { ...col, fixed: 'right' as const };
    if (col.fixed === 'left' || col.fixed === 'right') {
      const nextCol = { ...col };
      delete nextCol.fixed;
      return nextCol;
    }
    return col;
  };

  // 右不相连：address(R) — city — remark(R) — email — operation（镜像左：仅 name、dept 左固定）
  if (fixedTarget === 'rightDisconnected') {
    const orderedKeys = ['id', 'name', 'dept', 'address', 'city', 'remark', 'email', 'operation'];
    return orderedKeys.map((key) => attachFixed(colMap[key])).filter(Boolean);
  }

  // 右相连：remark + operation 贴右连续 fixed
  if (fixedTarget === 'rightConnected') {
    const orderedKeys = ['id', 'name', 'email', 'dept', 'city', 'address', 'remark', 'operation'];
    return orderedKeys.map((key) => attachFixed(colMap[key])).filter(Boolean);
  }

  return cols.map((col) => attachFixed(col));
}

export default function TableFixedColumnReorder() {
  const tableRef = useRef<PrimaryTableRef>(null);
  const [fixedTarget, setFixedTarget] = useState<FixedTarget>('none');

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
        cell: () => (
          <Button theme="primary" variant="text">
            查看
          </Button>
        ),
      },
    ],
    [],
  );

  const columns = useMemo(
    (): PrimaryTableCol[] => applyFixedTarget(baseColumns, fixedTarget),
    [baseColumns, fixedTarget],
  );

  const colWidths = useMemo(
    () =>
      Object.fromEntries(
        baseColumns.filter((col) => col.colKey).map((col) => [String(col.colKey), col.width as number]),
      ),
    [baseColumns],
  );

  const maxScrollLeft = useMemo(() => {
    const total = columns.reduce((sum, col) => sum + Number(col.width ?? colWidths[String(col.colKey)] ?? 0), 0);
    return Math.max(0, total - TABLE_CLIENT_WIDTH);
  }, [columns, colWidths]);

  const renderOrderHint = useMemo(() => {
    const defineOrder = columns.map((col) => col.colKey).join(' → ');
    const stageHints = getStageHints(fixedTarget);
    return { defineOrder, stageHints };
  }, [columns, fixedTarget]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={fixedTarget} variant="default-filled" onChange={(val: FixedTarget) => setFixedTarget(val)}>
        <Radio.Button value="none">不固定</Radio.Button>
        <Radio.Button value="name">左：固定 name</Radio.Button>
        <Radio.Button value="disconnected">左：不相连（name+dept）</Radio.Button>
        <Radio.Button value="connected">左：相连（id+name）</Radio.Button>
        <Radio.Button value="rightAddress">右：固定 address</Radio.Button>
        <Radio.Button value="rightDisconnected">右：不相连（address+remark）</Radio.Button>
        <Radio.Button value="rightConnected">右：相连（remark+operation）</Radio.Button>
      </Radio.Group>

      <Space>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('id')}>
          滚动到 ID
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('email')}>
          滚动到邮箱
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('address')}>
          滚动到地址
        </Button>
      </Space>

      <Space direction="vertical" size={4}>
        <Tag theme="default" variant="light">
          定义顺序：{renderOrderHint.defineOrder}
        </Tag>
        <Tag theme="primary" variant="light">
          scrollLeft=0 渲染顺序与定义一致
        </Tag>
        {fixedTarget === 'connected' && (
          <Tag theme="success" variant="light">
            从左连续 left fixed，不触发重排
          </Tag>
        )}
        {fixedTarget === 'rightConnected' && (
          <Tag theme="success" variant="light">
            从右连续 right fixed，不触发重排
          </Tag>
        )}
        {fixedTarget === 'rightDisconnected' && (
          <Tag theme="default" variant="outline">
            仅 address、remark 右固定（镜像左 name+dept）；city、email 可滚动，operation 贴末列不固定
          </Tag>
        )}
        {needsReorderHint(fixedTarget) && (
          <Tag theme="default" variant="outline">
            预估 maxScrollLeft ≈ {maxScrollLeft}px（表格宽 {TABLE_CLIENT_WIDTH}
            px）
          </Tag>
        )}
        {needsRightReorderHint(fixedTarget) && (
          <Tag theme="default" variant="outline">
            右侧 border 在重排阈值后出现；加粗还需横滚（scrollLeft &gt; 0 且未滚到底）
          </Tag>
        )}
        {renderOrderHint.stageHints.map((stage) => (
          <Tag key={stage.label} theme="warning" variant="light">
            {stage.label}：{stage.order}
          </Tag>
        ))}
      </Space>

      <Table
        ref={tableRef}
        bordered
        rowKey="id"
        data={data}
        maxHeight={320}
        style={{ width: TABLE_CLIENT_WIDTH }}
        columns={columns}
      />
    </Space>
  );
}
