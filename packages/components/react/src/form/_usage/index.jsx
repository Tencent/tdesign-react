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

import { Form, Input, Checkbox } from "tdesign-react";

export default function Usage() {
  const [configList, setConfigList] = useState(configProps);

  const { changedProps, onConfigChange } = useConfigChange(configList);

  const panelList = [{ label: "form", value: "form" }];

  const { panel, onPanelChange } = usePanelChange(panelList);

  const [renderComp, setRenderComp] = useState();

  const defaultProps = {};
  useEffect(() => {
    setRenderComp(
      <Form {...defaultProps} {...changedProps}>
        <Form.FormItem label="姓名" name="name" initialData="TDesign">
          <Input placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="手机号码" name="tel" initialData="123456">
          <Input placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="课程" name="course" initialData={["1"]}>
          <Checkbox.Group>
            <Checkbox value="1">语文</Checkbox>
            <Checkbox value="2">数学</Checkbox>
            <Checkbox value="3">英语</Checkbox>
            <Checkbox value="4">体育</Checkbox>
          </Checkbox.Group>
        </Form.FormItem>
      </Form>
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
