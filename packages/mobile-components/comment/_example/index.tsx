import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import Base from './base';
import Image from './image';
import Mixed from './mixed';
import Collapse from './collapse';
import './style/index.less';

export default function CommentDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Comment 评论"
        summary="评论用于对页面内容的反馈、评价、讨论等，如对文章的评价，对话题的讨论等。"
      />
      <TDemoBlock title="01 组件类型" summary="文本评论">
        <Base />
      </TDemoBlock>
      <TDemoBlock summary="图片评论">
        <Image />
      </TDemoBlock>
      <TDemoBlock summary="文字+图片评论">
        <Mixed />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="展开+收起">
        <Collapse />
      </TDemoBlock>
    </div>
  );
}
