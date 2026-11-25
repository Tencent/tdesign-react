import React from 'react';

import TDemoBlock from '../../../tdesign-mobile-react/site/mobile/components/DemoBlock';
import TDemoHeader from '../../../tdesign-mobile-react/site/mobile/components/DemoHeader';
import AnimationSkeleton from './animation';
import CellGroupSkeleton from './cell-group';
import GridSkeleton from './grid';
import ImageGroupSkeleton from './image-group';
import ThemeSkeleton from './theme';

import './style/index.less';

export default function SkeletonDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Skeleton 骨架屏"
        summary="用于等待加载内容所展示的占位图形组合，有动态效果加载效果，减少用户等待焦虑。"
        padding={true}
      />
      <TDemoBlock title="01 组件类型" padding={true}>
        <ThemeSkeleton />
      </TDemoBlock>
      <TDemoBlock summary="单元格骨架屏" padding={true}>
        <CellGroupSkeleton />
      </TDemoBlock>
      <TDemoBlock summary="宫格骨架屏" padding={true}>
        <GridSkeleton />
      </TDemoBlock>
      <TDemoBlock summary="图文组合骨架屏" padding={true}>
        <ImageGroupSkeleton />
      </TDemoBlock>
      <TDemoBlock title="02 组件动效" padding={true}>
        <AnimationSkeleton />
      </TDemoBlock>
    </div>
  );
}
