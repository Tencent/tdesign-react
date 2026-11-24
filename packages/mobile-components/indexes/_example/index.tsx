import React, { useState } from 'react';
import { Button } from 'tdesign-mobile-react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import Base from './base';
import Number from './number';
import Custom from './custom';
import './style/index.less';

export default function IndexesDemo() {
  // 当前页面 0初始页面，1字母索引，2数字索引，3胶囊索引
  const [page, setPage] = useState(0);
  if (page === 0) {
    return (
      <div className="tdesign-mobile-demo">
        <TDemoHeader title="Indexes 索引" summary="用于页面中信息快速检索，可以根据目录中的页码快速找到所需的内容。" />

        <TDemoBlock title="01 组件类型" summary="索引类型" padding>
          <div className="indexes-demo-buttons">
            <Button size="large" theme="primary" variant="outline" block onClick={() => setPage(1)}>
              字母索引
            </Button>
            <Button size="large" theme="primary" variant="outline" block onClick={() => setPage(2)}>
              数字索引
            </Button>
          </div>
        </TDemoBlock>
        <TDemoBlock title="02 组件样式" summary="其他索引列表样式" padding>
          <Button size="large" theme="primary" variant="outline" block onClick={() => setPage(3)}>
            胶囊索引
          </Button>
        </TDemoBlock>
      </div>
    );
  }

  const PageComponent = {
    1: Base,
    2: Number,
    3: Custom,
  }[page];

  return (
    <PageComponent
      goHome={() => {
        setPage(0);
      }}
    />
  );
}
