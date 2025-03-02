/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import BaseUsage, {
  useConfigChange,
  usePanelChange,
} from "@site/src/components/BaseUsage";
import jsxToString from "react-element-to-jsx-string";

import configProps from "./props.json";

import { Swiper } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "swiper", value: "swiper" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const defaultProps = { duration: 300, interval: 2000 };
  useEffect(() => {
    setRenderComp(
      <div style={{ width: 500 }}>
        <Swiper {...defaultProps} {...changedProps}>
          <Swiper.SwiperItem>
            <div
              style={{ height: 200, background: "var(--td-success-color-7)" }}
            ></div>
          </Swiper.SwiperItem>
          <Swiper.SwiperItem>
            <div
              style={{ height: 200, background: "var(--td-warning-color-7)" }}
            ></div>
          </Swiper.SwiperItem>
          <Swiper.SwiperItem>
            <div
              style={{ height: 200, background: "var(--td-error-color-7)" }}
            ></div>
          </Swiper.SwiperItem>
        </Swiper>
      </div>
    );
  }, [changedProps]);

  const jsxStr = useMemo(() => {
    if (!renderComp) return "";
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
