import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import FeedbackUsage from './feedback';
import ConfirmUsage from './confirm';
import InputUsage from './input';
import ImageUsage from './image-dialog';
import MultiStateUsage from './multi-state';
import './style/index.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Dialog 对话框"
        summary="用于显示重要提示或请求用户进行重要操作，一种打断当前操作的模态视图。"
      />
      <TDemoBlock title="01 组件类型" summary="反馈类对话框" padding={true}>
        <FeedbackUsage />
      </TDemoBlock>
      <TDemoBlock summary="确认类对话框" padding={true}>
        <ConfirmUsage />
      </TDemoBlock>
      <TDemoBlock summary="输入类对话框" padding={true}>
        <InputUsage />
      </TDemoBlock>
      <TDemoBlock summary="带图片的对话框" padding={true}>
        <ImageUsage />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="文字按钮" padding={true}>
        <MultiStateUsage />
      </TDemoBlock>
      {/* <TDemoBlock title="03 组件用法" summary="命令调用" padding={true}>
        <PluginUsage />
      </TDemoBlock> */}
    </div>
  );
}
