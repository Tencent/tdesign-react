import React from 'react';
import { Toast, Button } from 'tdesign-mobile-react';

const DemoBlock = ({ summary, children }: { summary?: string; children?: React.ReactNode }) => (
  <div className="tdesign-mobile-demo-block tdesign-mobile-demo-block_subtitle">
    <div className="tdesign-mobile-demo-block__header">
      <p className="tdesign-mobile-demo-block__summary tdesign-mobile-demo-block_subtitle">{summary}</p>
    </div>
    <div className="tdesign-mobile-demo-block__slot with-padding">{children}</div>
  </div>
);

export default function () {
  const successColumn = () => {
    Toast({ message: '轻提示文字内容', theme: 'success', direction: 'column' });
  };

  const warningColumn = () => {
    Toast({ message: '轻提示文字内容', theme: 'warning', direction: 'column' });
  };

  const errorColumn = () => {
    Toast({ message: '轻提示文字内容', theme: 'error', direction: 'column' });
  };

  return (
    <div className="toast-demo">
      <DemoBlock summary="成功提示">
        <Button block theme="primary" variant="outline" size="large" onClick={successColumn}>
          成功提示
        </Button>
      </DemoBlock>

      <DemoBlock summary="警告提示">
        <Button block theme="primary" variant="outline" size="large" onClick={warningColumn}>
          警告提示
        </Button>
      </DemoBlock>

      <DemoBlock summary="失败提示">
        <Button block theme="primary" variant="outline" size="large" onClick={errorColumn}>
          失败提示
        </Button>
      </DemoBlock>
    </div>
  );
}
