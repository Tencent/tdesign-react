import React from 'react';
import { SwipeCell, Cell, Toast } from 'tdesign-mobile-react';

const DemoBlock = ({ summary, children }: { summary?: string; children?: React.ReactNode }) => (
  <div className="tdesign-mobile-demo-block tdesign-mobile-demo-block_subtitle">
    <div className="tdesign-mobile-demo-block__header">
      <p className="tdesign-mobile-demo-block__summary tdesign-mobile-demo-block_subtitle">{summary}</p>
    </div>
    <div className="tdesign-mobile-demo-block__slot">{children}</div>
  </div>
);

export default function Demo() {
  const handleClick = (message = 'click') => {
    Toast({
      message,
    });
  };

  const leftButton = (
    <div className="btn favor-btn" onClick={() => handleClick()}>
      删除
    </div>
  );
  const rightButtons = (
    <>
      <div className="btn favor-btn" onClick={() => handleClick('收藏')}>
        收藏
      </div>
      <div className="btn delete-btn" onClick={() => handleClick('删除')}>
        删除
      </div>
    </>
  );

  return (
    <DemoBlock summary="左右滑操作">
      <SwipeCell left={leftButton} right={rightButtons} content={<Cell title="左右滑操作" note="辅助信息" />} opened />
    </DemoBlock>
  );
}
