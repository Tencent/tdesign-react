/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-react';

import { Table, Tag } from 'tdesign-react';
import baseTableConfigProps from './base-table-props.json';

export default function Usage() {
  const [configList, setConfigList] = useState(baseTableConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: 'Table', value: 'baseTable', config: baseTableConfigProps }];

  const data = Array(30)
    .fill(0)
    .map((_, i) => ({
      index: i,
      applicant: ['贾明', '张三', '王芳'][i % 3],
      status: i % 3,
      channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
      detail: {
        email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
      },
    }));

    const statusNameListMap = {
      0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
      1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
      2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
    };
  const columns = [
    { colKey: 'applicant', title: '申请人', width: '120' },
  {
    colKey: 'status',
    title: '审批状态',
    width: '120',
    cell: ({ row }) => (
        <Tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
          {statusNameListMap[row.status].icon}
          {statusNameListMap[row.status].label}
        </Tag>
      ),
  },
  { colKey: 'channel', title: '签署方式' },
  { colKey: 'detail.email', title: '电子邮件' },
  ];

  const defaultProps = {
    data,
    columns,
  };

  const panelMap = {
    baseTable: <Table {...defaultProps} {...changedProps} />,
  };

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    setRenderComp(panelMap[panel]);
  }, [changedProps, panel]);

  const jsxStr = useMemo(() => {
    if (!renderComp) return '';
    return jsxToString(renderComp);
  }, [renderComp]);

  return (
    <BaseUsage
      code={jsxStr}
      panelList={panelList}
      configList={configList}
      onPanelChange={onPanelChange}
      onConfigChange={onConfigChange}
    >
      {renderComp}
    </BaseUsage>
  );
}
