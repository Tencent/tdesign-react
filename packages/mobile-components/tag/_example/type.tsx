import React from 'react';
import { DiscountIcon } from 'tdesign-icons-react';
import { Tag } from 'tdesign-mobile-react';

const TypeDemo = () => (
  <>
    <div className="summary">基础标签</div>
    <div className="tag-demo">
      <Tag variant="light">标签文字</Tag>
      <Tag variant="outline">标签文字</Tag>
    </div>
    <div className="summary">圆弧标签</div>
    <div className="tag-demo">
      <Tag variant="light" shape="round">
        标签文字
      </Tag>
      <Tag variant="outline" shape="round">
        标签文字
      </Tag>
      <Tag variant="outline" shape="mark">
        标签文字
      </Tag>
    </div>
    <div className="summary">带图标的标签</div>
    <div className="tag-demo">
      <Tag variant="light" icon={<DiscountIcon />}>
        标签文字
      </Tag>
      <Tag variant="outline" icon={<DiscountIcon />}>
        标签文字
      </Tag>
    </div>
    <div className="summary">超长文本省略标签</div>
    <div className="tag-demo">
      <Tag maxWidth="130px" variant="light">
        听说超长可以省略听说超长
      </Tag>
    </div>
  </>
);

export default TypeDemo;
