/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import jsxToString from 'react-element-to-jsx-string';
import { ColorPicker, ColorPickerPanel } from 'tdesign-react';
import BaseUsage, { useConfigChange, usePanelChange } from '@tdesign/react-site/src/components/BaseUsage';

import ColorPickerPanelConfigProps from './panel-props.json';
import ColorPickerConfigProps from './props.json';

export default function Usage() {
  const [configList, setConfigList] = useState(ColorPickerConfigProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [
    { label: 'colorPicker', value: 'colorPicker', config: ColorPickerConfigProps },
    {
      label: 'colorPickerPanel',
      value: 'colorPickerPanel',
      config: ColorPickerPanelConfigProps,
    },
  ];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  useEffect(() => {
    setConfigList(panel === 'colorPicker' ? ColorPickerConfigProps : ColorPickerPanelConfigProps);
    const componentProps = { defaultValue: 'rgb(0, 82, 217)', ...changedProps };
    setRenderComp(
      panel === 'colorPicker' ? <ColorPicker {...componentProps} /> : <ColorPickerPanel {...componentProps} />,
    );
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
