import React, { useState } from 'react';
import { Cell, Sticky, Switch, TabPanel, Tabs } from 'tdesign-mobile-react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import BaseForm from './base';
import HelpForm from './help';
import RulesForm from './rules';
import LabelAlign from './label-align';
import LabelWidth from './label-width';
import RequiredMark from './required-mark';
import ColonForm from './colon';
import ContentAlign from './content-align';
import './style/index.less';

export default function FormDemo() {
  const [layout, setLayout] = useState('horizontal');
  const [disabled, setDisabled] = useState(false);

  const isHorizontal = layout === 'horizontal';
  const labelAlign = isHorizontal ? 'left' : 'top';

  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Form 表单"
        summary="用以收集、校验和提交数据，一般由输入框、单选框、复选框、选择器等控件组成。"
      />
      <Sticky>
        <div className="form-demo-sticky">
          <Tabs
            value={layout}
            theme="tag"
            stickyProps={{ disabled: true }}
            onChange={(value) => setLayout(String(value))}
          >
            <TabPanel value="horizontal" label="水平排布" />
            <TabPanel value="vertical" label="竖向排布" />
          </Tabs>
          <Cell title="禁用态">
            <Switch value={disabled} onChange={(value) => setDisabled(Boolean(value))} />
          </Cell>
        </div>
      </Sticky>
      <TDemoBlock title="01 组件类型" summary="基础表单">
        <BaseForm labelAlign={labelAlign} disabled={disabled} />
      </TDemoBlock>
      <TDemoBlock title="02 组件状态" summary="提示">
        <HelpForm labelAlign={labelAlign} disabled={disabled} />
      </TDemoBlock>
      <TDemoBlock summary="校验规则">
        <RulesForm labelAlign={labelAlign} disabled={disabled} />
      </TDemoBlock>
      {isHorizontal ? (
        <>
          <TDemoBlock title="03 组件样式" summary="标签对齐样式">
            <LabelAlign disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签带冒号">
            <ColonForm labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签必填位置">
            <RequiredMark labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签宽度">
            <LabelWidth disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签内容对齐样式">
            <ContentAlign labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
        </>
      ) : (
        <>
          <TDemoBlock title="03 组件样式" summary="标签必填位置">
            <RequiredMark labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签带冒号">
            <ColonForm labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
          <TDemoBlock summary="标签内容对齐样式">
            <ContentAlign labelAlign={labelAlign} disabled={disabled} />
          </TDemoBlock>
        </>
      )}
    </div>
  );
}
