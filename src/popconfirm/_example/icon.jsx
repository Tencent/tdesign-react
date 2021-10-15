import React from 'react';
import { Button, BrowseIcon, PopConfirm } from '@tencent/tdesign-react';

export default function IconUsageExample() {
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <PopConfirm content={'普通事件通知类型偏向于确认'}>
          <Button theme="primary">默认</Button>
        </PopConfirm>
        <PopConfirm
          content={'事件通知类型偏向于提示'}
          theme={'warning'}
        >
          <Button theme="warning">警告</Button>
        </PopConfirm>
        <PopConfirm
          content={'事件通知类型偏向于高危提醒'}
          theme={'danger'}
        >
          <Button theme="danger">危险</Button>
        </PopConfirm>
      </div>
      <div className="tdesign-demo-block-row">
        <PopConfirm content={'基础气泡确认框文案示意文字按钮'} icon={<BrowseIcon />}>
          <Button theme="primary">图标（属性）</Button>
        </PopConfirm>
      </div>
    </div>
  );
}
