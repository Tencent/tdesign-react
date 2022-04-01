/**
 *  该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整
 */

// @ts-nocheck
import React from "react";
import BaseUsage, { useConfigChange } from "@site/src/components/BaseUsage";
import jsxToString from "jsx-to-string";
import configList from "./props.json";

import { Swiper } from "tdesign-react";

export default function Usage() {
  const { changedProps, onConfigChange } = useConfigChange(configList);

  const defaultProps = { duration: 300, interval: 2000 };
  const renderComp = (
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
