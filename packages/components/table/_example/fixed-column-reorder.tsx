import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Radio, Space, Table, Tag } from 'tdesign-react';

import type { PrimaryTableRef } from '../interface';
import type { PrimaryTableCol, TableRowData } from '../type';

const TABLE_WIDTH = 720;

/**
 * 全部模式（含 None）共用同一套列定义：仅 `fixed` 不同，列序 / title / width 永不改变。
 * header 始终为：ID | Name | Email | Dept | Address | City | Remark | Operation
 */
const COLUMN_KEYS = ['id', 'name', 'email', 'dept', 'address', 'city', 'remark', 'operation'] as const;

type ColumnKey = (typeof COLUMN_KEYS)[number];

type DemoMode =
  | 'none'
  | 'leftName'
  | 'leftDisconnected'
  | 'leftConnected'
  | 'rightAddress'
  | 'rightDisconnected'
  | 'rightConnected';

type DemoModeConfig = {
  label: string;
  leftFixed?: ColumnKey[];
  rightFixed?: ColumnKey[];
  note?: string;
};

const LEFT_MODES = ['leftName', 'leftDisconnected', 'leftConnected'] as const satisfies readonly DemoMode[];
const RIGHT_MODES = ['rightAddress', 'rightDisconnected', 'rightConnected'] as const satisfies readonly DemoMode[];

const DEMO_MODES: Record<DemoMode, DemoModeConfig> = {
  none: { label: 'None' },
  leftName: {
    label: 'name',
    leftFixed: ['name'],
    note: 'Reorder when scrollLeft ≥ 100',
  },
  leftDisconnected: {
    label: 'disconnected (name+dept)',
    leftFixed: ['name', 'dept'],
    note: 'name @ 100px, dept @ 400px',
  },
  leftConnected: {
    label: 'connected (id+name)',
    leftFixed: ['id', 'name'],
    note: 'Trailing left fixed, no reorder',
  },
  rightAddress: {
    label: 'address',
    rightFixed: ['address'],
    note: 'Border until scrollLeft ≥ 20',
  },
  rightDisconnected: {
    label: 'disconnected (address+remark)',
    rightFixed: ['address', 'remark'],
    note: 'scroll=0 两列贴右；address 达 scroll≥20 重排并取消 sticky，border 立即交 remark',
  },
  rightConnected: {
    label: 'connected (remark+operation)',
    rightFixed: ['remark', 'operation'],
    note: 'Trailing right fixed at end, no reorder',
  },
};

const COLUMN_META: Record<ColumnKey, { title: string; width: number }> = {
  id: { title: 'ID', width: 100 },
  name: { title: 'Name', width: 120 },
  email: { title: 'Email', width: 180 },
  dept: { title: 'Dept', width: 120 },
  address: { title: 'Address', width: 220 },
  remark: { title: 'Remark', width: 160 },
  city: { title: 'City', width: 120 },
  operation: { title: 'Operation', width: 100 },
};

const TABLE_DATA: TableRowData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: ['Alice', 'Bob', 'Carol'][i % 3],
  email: ['a@example.com', 'b@example.com', 'c@example.com'][i % 3],
  dept: ['R&D', 'Design', 'Product'][i % 3],
  city: ['Shenzhen', 'Shanghai', 'Beijing'][i % 3],
  address: ['Nanshan', 'Lujiazui', 'Wangjing'][i % 3],
  remark: ['Note A', 'Note B', 'Note C'][i % 3],
}));

function buildColumn(colKey: ColumnKey): PrimaryTableCol {
  const meta = COLUMN_META[colKey];
  if (colKey === 'operation') {
    return {
      colKey,
      title: meta.title,
      width: meta.width,
      cell: () => (
        <Button theme="primary" variant="text">
          View
        </Button>
      ),
    };
  }
  return { colKey, title: meta.title, width: meta.width };
}

/** 与 None 模式完全相同的列定义（无 fixed） */
const BASE_COLUMNS: PrimaryTableCol[] = COLUMN_KEYS.map((colKey) => buildColumn(colKey));

/** 仅附加 fixed，不改变列序与其它字段 */
function applyFixedMode(mode: DemoMode): PrimaryTableCol[] {
  const { leftFixed = [], rightFixed = [] } = DEMO_MODES[mode];
  const leftSet = new Set(leftFixed);
  const rightSet = new Set(rightFixed);

  return BASE_COLUMNS.map((col) => {
    const colKey = String(col.colKey) as ColumnKey;
    const next: PrimaryTableCol = { ...col };
    delete next.fixed;
    if (leftSet.has(colKey)) next.fixed = 'left';
    else if (rightSet.has(colKey)) next.fixed = 'right';
    return next;
  });
}

function sumColumnWidth(columns: PrimaryTableCol[]): number {
  return columns.reduce((sum, col) => sum + Number(col.width ?? 0), 0);
}

function getHeaderSignature(columns: PrimaryTableCol[]): string {
  return columns.map((col) => col.title).join(' | ');
}

/** 从表头 DOM 读取 colKey 顺序（反映 Table 是否做了列重排） */
function readDomHeaderColKeys(tableRoot: HTMLElement | null): ColumnKey[] {
  if (!tableRoot) return [];
  const headerCells = tableRoot.querySelectorAll('thead tr:first-child th[data-colkey]');
  return Array.from(headerCells)
    .map((th) => th.getAttribute('data-colkey'))
    .filter((key): key is ColumnKey => !!key && COLUMN_KEYS.includes(key as ColumnKey));
}

/** 按视口 left 排序，得到肉眼看到的从左到右表头顺序 */
function readVisualHeaderColKeys(tableRoot: HTMLElement | null): ColumnKey[] {
  if (!tableRoot) return [];
  const headerCells = tableRoot.querySelectorAll('thead tr:first-child th[data-colkey]');
  return Array.from(headerCells)
    .map((th) => ({
      colKey: th.getAttribute('data-colkey') as ColumnKey,
      left: th.getBoundingClientRect().left,
    }))
    .filter((item): item is { colKey: ColumnKey; left: number } => !!item.colKey)
    .sort((a, b) => a.left - b.left)
    .map((item) => item.colKey);
}

function colKeysToTitles(keys: ColumnKey[]): string {
  return keys.map((key) => COLUMN_META[key].title).join(' | ');
}

const NONE_COL_KEYS = [...COLUMN_KEYS];

function isRightFixedMode(mode: DemoMode): boolean {
  return (RIGHT_MODES as readonly DemoMode[]).includes(mode);
}

function getScrollCompareSuffix(
  hasData: boolean,
  atScrollStart: boolean,
  matchesNone: boolean,
  scrolledOkText: string,
  mismatchText: string,
  rightFixedAtStart = false,
): string {
  if (!hasData) return '';
  if (!atScrollStart) return scrolledOkText;
  if (rightFixedAtStart) {
    return matchesNone ? ' ✗ 未出现右 fixed 贴边' : ' ✓ 右 fixed 已贴边（两列 fixed 正常）';
  }
  return matchesNone ? ' ✓ 与 None 一致' : mismatchText;
}

export default function TableFixedColumnReorder() {
  const tableRef = useRef<PrimaryTableRef>(null);
  const [mode, setMode] = useState<DemoMode>('none');
  const [scrollLeft, setScrollLeft] = useState(0);
  const [domColKeys, setDomColKeys] = useState<ColumnKey[]>([]);
  const [visualColKeys, setVisualColKeys] = useState<ColumnKey[]>([]);

  const modeConfig = DEMO_MODES[mode];
  const columns = useMemo(() => applyFixedMode(mode), [mode]);
  const maxScrollLeft = useMemo(() => Math.max(0, sumColumnWidth(columns) - TABLE_WIDTH), [columns]);
  const configColKeys = useMemo(() => columns.map((col) => String(col.colKey) as ColumnKey), [columns]);
  const configHeader = getHeaderSignature(columns);
  const isAtScrollStart = scrollLeft <= 0;
  const expectsRightFixedVisualDiff = isRightFixedMode(mode) && isAtScrollStart;
  const domMatchesNone =
    domColKeys.length === NONE_COL_KEYS.length && domColKeys.every((key, i) => key === NONE_COL_KEYS[i]);
  const visualMatchesNone =
    visualColKeys.length === NONE_COL_KEYS.length && visualColKeys.every((key, i) => key === NONE_COL_KEYS[i]);

  const readHeaderState = () => {
    const tableRoot = tableRef.current?.tableHtmlElement;
    const content = tableRef.current?.tableContentElement;
    if (content) setScrollLeft(content.scrollLeft);
    setDomColKeys(readDomHeaderColKeys(tableRoot ?? null));
    setVisualColKeys(readVisualHeaderColKeys(tableRoot ?? null));
  };

  // 切换模式时回到 scrollLeft=0，避免沿用上一模式的滚动 / 重排列序
  useEffect(() => {
    const content = tableRef.current?.tableContentElement;
    if (content) {
      if (typeof content.scrollTo === 'function') {
        content.scrollTo({ left: 0 });
      } else {
        content.scrollLeft = 0;
      }
    }
    setScrollLeft(0);
  }, [mode]);

  // 渲染后读取表头状态
  useEffect(() => {
    const raf = requestAnimationFrame(readHeaderState);
    return () => cancelAnimationFrame(raf);
  }, [mode, columns]);

  const handleTableScroll = () => {
    requestAnimationFrame(readHeaderState);
  };

  let domTagTheme: 'success' | 'danger' | 'primary' = 'primary';
  if (isAtScrollStart) {
    domTagTheme = domMatchesNone ? 'success' : 'danger';
  }

  const domTagSuffix = getScrollCompareSuffix(
    domColKeys.length > 0,
    isAtScrollStart,
    domMatchesNone,
    '（滚动/重排后变化属正常）',
    ' ✗ 与 None 不一致',
  );

  let visualTagTheme: 'success' | 'danger' | 'primary' = 'primary';
  if (isAtScrollStart) {
    if (expectsRightFixedVisualDiff) {
      visualTagTheme = visualMatchesNone ? 'danger' : 'success';
    } else {
      visualTagTheme = visualMatchesNone ? 'success' : 'danger';
    }
  }

  const visualTagSuffix = getScrollCompareSuffix(
    visualColKeys.length > 0,
    isAtScrollStart,
    visualMatchesNone,
    ' ✓ 右 fixed 滚动后视觉变化正常',
    ' ✗ 与 None 不一致',
    expectsRightFixedVisualDiff,
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group value={mode} variant="default-filled" onChange={(val: DemoMode) => setMode(val)}>
        <Space direction="vertical" size={12}>
          <Radio.Button value="none">{DEMO_MODES.none.label}</Radio.Button>

          <Space align="center" size={8}>
            <Tag theme="default" variant="outline" style={{ minWidth: 48, textAlign: 'center' }}>
              左侧
            </Tag>
            {LEFT_MODES.map((key) => (
              <Radio.Button key={key} value={key}>
                {DEMO_MODES[key].label}
              </Radio.Button>
            ))}
          </Space>

          <Space align="center" size={8}>
            <Tag theme="default" variant="outline" style={{ minWidth: 48, textAlign: 'center' }}>
              右侧
            </Tag>
            {RIGHT_MODES.map((key) => (
              <Radio.Button key={key} value={key}>
                {DEMO_MODES[key].label}
              </Radio.Button>
            ))}
          </Space>
        </Space>
      </Radio.Group>

      <Space>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('id')}>
          Scroll to ID
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('email')}>
          Scroll to Email
        </Button>
        <Button variant="outline" onClick={() => tableRef.current?.scrollColumnIntoView('address')}>
          Scroll to Address
        </Button>
      </Space>

      <Space direction="vertical" size={4}>
        <Tag theme="default" variant="outline">
          columns 定义（colKey）: {configColKeys.join(' → ')}
        </Tag>
        <Tag theme="default" variant="outline">
          columns title: {configHeader}
        </Tag>
        <Tag theme={domTagTheme} variant="light">
          DOM 表头顺序（scrollLeft={scrollLeft}px）: {domColKeys.length ? colKeysToTitles(domColKeys) : '读取中…'}
          {domTagSuffix}
        </Tag>
        <Tag theme={visualTagTheme} variant="light">
          视觉从左到右（scrollLeft={scrollLeft}px）:
          {visualColKeys.length ? colKeysToTitles(visualColKeys) : '读取中…'}
          {visualTagSuffix}
        </Tag>
        {modeConfig.note && (
          <Tag theme="warning" variant="light">
            {modeConfig.note}
          </Tag>
        )}
        {mode !== 'none' && mode !== 'leftConnected' && mode !== 'rightConnected' && (
          <Tag theme="default" variant="outline">
            maxScrollLeft ≈ {maxScrollLeft}px（table {TABLE_WIDTH}px）
          </Tag>
        )}
      </Space>

      <Table
        key={mode}
        ref={tableRef}
        bordered
        rowKey="id"
        data={TABLE_DATA}
        columns={columns}
        maxHeight={320}
        style={{ width: TABLE_WIDTH }}
        onScroll={handleTableScroll}
      />
    </Space>
  );
}
