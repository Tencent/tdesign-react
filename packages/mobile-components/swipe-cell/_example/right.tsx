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

  const oneButton = (
    <div className="btn favor-btn" onClick={() => handleClick()}>
      选择
    </div>
  );

  return (
    <DemoBlock summary="右滑单操作">
      <SwipeCell left={oneButton} content={<Cell title="右滑单操作" note="辅助信息" />} opened />
    </DemoBlock>
  );
}
