import React from 'react';
import { Tag } from 'tdesign-mobile-react';

const ThemeDemo = () => (
  <>
    <div className="summary">展示型标签</div>
    <div className="tag-demo">
      <div>
        <div className="tag-block">
          <Tag variant="light">默认</Tag>
          <Tag variant="light" theme="primary">
            主要
          </Tag>
          <Tag variant="light" theme="warning">
            警告
          </Tag>
          <Tag variant="light" theme="danger">
            危险
          </Tag>
          <Tag variant="light" theme="success">
            成功
          </Tag>
        </div>
        <div className="tag-block">
          <Tag theme="default">默认</Tag>
          <Tag theme="primary">主要</Tag>
          <Tag theme="warning">警告</Tag>
          <Tag theme="danger">危险</Tag>
          <Tag theme="success">成功</Tag>
        </div>
        <div className="tag-block">
          <Tag variant="outline">默认</Tag>
          <Tag variant="outline" theme="primary">
            主要
          </Tag>
          <Tag variant="outline" theme="warning">
            警告
          </Tag>
          <Tag variant="outline" theme="danger">
            危险
          </Tag>
          <Tag variant="outline" theme="success">
            成功
          </Tag>
        </div>
        <div className="tag-block">
          <Tag variant="light-outline">默认</Tag>
          <Tag variant="light-outline" theme="primary">
            主要
          </Tag>
          <Tag variant="light-outline" theme="warning">
            警告
          </Tag>
          <Tag variant="light-outline" theme="danger">
            危险
          </Tag>
          <Tag variant="light-outline" theme="success">
            成功
          </Tag>
        </div>
      </div>
    </div>
  </>
);

export default ThemeDemo;
