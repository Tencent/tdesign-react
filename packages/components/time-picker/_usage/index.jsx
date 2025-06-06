/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';
import jsxToString from 'react-element-to-jsx-string';

import TimePickerConfigProps from './time-picker-props.json';

import TimeRangePickerConfigProps from './time-range-picker-props.json';

import { TimePicker, TimeRangePicker } from 'tdesign-react';

export default function Usage() {
  const [configList, setConfigList] = useState(TimePickerConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: 'timePicker', value: 'timePicker', config: TimePickerConfigProps },
    {
      label: 'timeRangePicker',
      value: 'timeRangePicker',
      config: TimeRangePickerConfigProps,
    },
  ];

  const panelMap = {
    timePicker: <TimePicker {...changedProps} />,
    timeRangePicker: <TimeRangePicker {...changedProps} />,
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
