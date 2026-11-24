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
  const onlyText = () => {
    Toast('轻提示文字内容');
  };

  const textMaxHeight = () => {
    Toast({
      message: '最多一行展示十个汉字宽度限制最多不超过三行文字行文字行文字',
    });
  };

  const iconHori = () => {
    Toast({ message: '轻提示文字内容', theme: 'success' });
  };

  const iconColumn = () => {
    Toast({ message: '轻提示文字内容', theme: 'success', direction: 'column' });
  };

  const iconLoading = () => {
    Toast({ message: '轻提示文字内容', theme: 'loading' });
  };

  return (
    <div className="toast-demo">
      <DemoBlock summary="纯文本">
        <Button block theme="primary" variant="outline" size="large" onClick={onlyText}>
          纯文本
        </Button>
      </DemoBlock>

      <DemoBlock summary="多行文字">
        <Button block theme="primary" variant="outline" size="large" onClick={textMaxHeight}>
          多行文字
        </Button>
      </DemoBlock>

      <DemoBlock summary="带横向图标">
        <Button block theme="primary" variant="outline" size="large" onClick={iconHori}>
          带横向图标
        </Button>
      </DemoBlock>

      <DemoBlock summary="带竖向图标">
        <Button block theme="primary" variant="outline" size="large" onClick={iconColumn}>
          带竖向图标
        </Button>
      </DemoBlock>

      <DemoBlock summary="加载状态">
        <Button block theme="primary" variant="outline" size="large" onClick={iconLoading}>
          加载状态
        </Button>
      </DemoBlock>
    </div>
  );
}
