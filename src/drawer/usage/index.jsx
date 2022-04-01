/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Drawer, Button } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const [visible, setVisible] = React.useState(false);
  const defaultProps = { onClose: () => setVisible(false) };
  React.useEffect(() => {
    if (changedProps.visible) setVisible(true);
  }, [changedProps, visible]);
  const renderComp = (
    <div>
      <Button onClick={() => setVisible(true)}>Open Drawer</Button>
      <Drawer {...defaultProps} {...changedProps} visible={visible}>
        <p>This is a Drawer</p>
      </Drawer>
    </div>
  );

  const jsxStr = jsxToString(renderComp);

  return (
    <BaseUsage
      code={jsxStr}
      configList={configList}
      onConfigChange={onConfigChange}
    >
      {renderComp}
    </BaseUsage>
  );
}
