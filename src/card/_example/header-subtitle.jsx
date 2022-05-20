import React from 'react';
import { Card } from 'tdesign-react';

export default function HeaderSubtitleCard() {
  return (
    <div className="tdesign-demo-block">
      <Card title="标题" subtitle="副标题" actions="操作" bordered hoverShadow header style={{ width: '400px' }}>
        卡片内容，以描述性为主，可以是文字、图片或图文组合的形式。按业务需求进行自定义组合。
      </Card>
    </div>
  );
}
