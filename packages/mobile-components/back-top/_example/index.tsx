import React, { useCallback, useRef, useState } from 'react';
import { BackTop, Skeleton } from 'tdesign-mobile-react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import './style/index.less';
import BaseDemo from './base';
import HalfRoundDemo from './half-round';

export default function BackTopDemo() {
  const [visible, setVisible] = useState(false);
  const [backTop, setBackTop] = useState<{ theme: 'round' | 'half-round'; text: string }>({
    theme: 'round',
    text: '顶部',
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const onButtonClick = useCallback((theme: 'round' | 'half-round', text: string) => {
    setBackTop({ theme, text });
    setVisible(true);
    if (containerRef.current) {
      containerRef.current.scrollTop = 1200;
    }
  }, []);

  const handleToTop = () => {
    console.log('handleToTop');
  };

  const rowCols = [
    {
      width: '165.5px',
      height: '165.5px',
      borderRadius: '12px',
    },
    1,
    {
      width: '100px',
    },
  ];

  return (
    <div ref={containerRef} className="tdesign-mobile-react-demo">
      <TDemoHeader title="BackTop 返回顶部" summary="用于当页面过长往下滑动时，帮助用户快速回到页面顶部。" />
      <TDemoBlock title="组件类型" summary="圆形返回顶部" padding>
        <BaseDemo onButtonClick={onButtonClick} />
      </TDemoBlock>
      <TDemoBlock summary="半圆形返回顶部" padding>
        <HalfRoundDemo onButtonClick={onButtonClick} />
      </TDemoBlock>

      <div className="group">
        {Array.from(Array(6), (_, key) => (
          <div className="item" key={key}>
            <Skeleton theme="text" rowCol={rowCols} />
          </div>
        ))}
      </div>

      {visible ? (
        <BackTop
          text={backTop.text}
          theme={backTop.theme}
          onToTop={handleToTop}
          container={() => containerRef.current}
        />
      ) : null}
    </div>
  );
}
