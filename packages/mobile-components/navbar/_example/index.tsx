import React from 'react';
import { Navbar } from 'tdesign-mobile-react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseDemo from './base';
import SearchDemo from './search';
import ImgDemo from './img';
import LeftTitleDemo from './left-title';
import CustomColorDemo from './custom-color';
import SizeDemo from './size';
import './style/index.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <Navbar title="Navbar 导航条" style={{ zIndex: 999 }} leftArrow fixed />

      <TDemoHeader title="Navbar 导航栏" summary="用于不同页面之间切换或者跳转，位于内容区的上方，系统状态栏的下方。" />
      <TDemoBlock title="01 组件类型" summary="基础导航栏">
        <div className="t-navbar-demo">
          <BaseDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="带搜索导航栏">
        <div className="t-navbar-demo">
          <SearchDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="带图片导航栏">
        <div className="t-navbar-demo">
          <ImgDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock title="02 组件样式" summary="标题对齐">
        <div className="t-navbar-demo">
          <LeftTitleDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="标题尺寸">
        <div className="t-navbar-demo">
          <SizeDemo />
        </div>
      </TDemoBlock>

      <TDemoBlock summary="自定义颜色">
        <div className="t-navbar-demo">
          <CustomColorDemo />
        </div>
      </TDemoBlock>
    </div>
  );
}
