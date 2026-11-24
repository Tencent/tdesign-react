import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'tdesign-mobile-react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import './style/index.less';
import './style/base.less';
import './style/custom.less';
import './style/switch.less';

export default function Base() {
  const navigate = useNavigate();
  const handleClick = (t = 'base') => {
    navigate(`/side-bar-${t}?showNavBack=true`);
  };
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="SideBar 侧边栏" summary="用于信息分类后的展示切换或锚点，位于页面左侧。" />
      <TDemoBlock title="01 组件类型" summary="侧边导航用法" padding>
        <Button size="large" theme="primary" variant="outline" block onClick={() => handleClick('base')}>
          锚点用法
        </Button>
        <Button size="large" theme="primary" variant="outline" block onClick={() => handleClick('switch')}>
          切页用法
        </Button>
      </TDemoBlock>
      <TDemoBlock summary="带图标侧边导航" padding>
        <Button size="large" theme="primary" variant="outline" block onClick={() => handleClick('with-icon')}>
          带图标侧边导航
        </Button>
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="侧边导航样式" padding>
        <Button size="large" theme="primary" variant="outline" block onClick={() => handleClick('custom')}>
          自定义样式
        </Button>
      </TDemoBlock>
    </div>
  );
}
