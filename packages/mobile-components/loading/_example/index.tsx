import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseLoading from './base';
import HorzLoading from './horz';
import VertLoading from './vert';
import PureTextLoading from './pure-text';
import SizeLoading from './size';
import SpeedLoading from './speed';
// import FullScreenLoading from './fullscreen';
// import AttachLoading from './attach';
// import PluginLoading from './service';
// import DelayLoading from './delay';

import './style/index.less';

export default function () {
  return (
    <>
      <TDemoHeader
        title="Loading 加载"
        summary="用于表示页面或操作的加载状态，给予用户反馈的同时减缓等待的焦虑感，由一个或一组反馈动效组成。"
      />
      <TDemoBlock title="01 组件类型" summary="纯图标" padding={true}>
        <div className="loading-demo--flex">
          <BaseLoading />
        </div>
      </TDemoBlock>
      <TDemoBlock summary="图标加文字（横向）" padding={true}>
        <div className="loading-demo--flex">
          <HorzLoading />
        </div>
      </TDemoBlock>
      <TDemoBlock summary="图标加文字（纵向）" padding={true}>
        <div className="loading-demo--flex">
          <VertLoading />
        </div>
      </TDemoBlock>
      <TDemoBlock summary="纯文字" padding={true}>
        <div className="loading-demo--flex">
          <PureTextLoading />
        </div>
      </TDemoBlock>
      <TDemoBlock title="02 组件尺寸" padding={true}>
        <SizeLoading />
      </TDemoBlock>
      <TDemoBlock title="03 加载速度" summary="加载速度调整">
        <SpeedLoading />
      </TDemoBlock>
      {/* 视觉稿待定，暂时注释 */}
      {/* <TDemoBlock title="04 全屏加载" summary="全屏展示加载状态，阻止用户操作。">
        <FullScreenLoading />
      </TDemoBlock>
      <TDemoBlock title="05 延迟加载">
        <DelayLoading />
      </TDemoBlock>
      <TDemoBlock
        title="06 挂载到指定元素"
        summary="可通过 attach 挂载到指定元素。注：被挂载元素（loading的父元素）需设置：position: relative;"
      >
        <AttachLoading />
      </TDemoBlock>
      <TDemoBlock title="07 函数方式调用">
        <PluginLoading />
      </TDemoBlock> */}
    </>
  );
}
