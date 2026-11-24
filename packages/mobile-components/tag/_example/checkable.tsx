import React from 'react';
import { TagCheck } from 'tdesign-mobile-react';

const CheckeableDemo = () => {
  const variants: ('dark' | 'light' | 'outline' | 'light-outline')[] = ['light', 'dark', 'outline', 'light-outline'];

  return (
    <>
      <div className="summary">可选中的标签</div>
      <div className="tag-demo">
        <div>
          {variants.map((item, index) => (
            <div className="tag-block check-tag-block" key={index}>
              <div className="check-tag-block__title">{item}</div>
              <TagCheck variant={item} size="large" content={['已选中态', '未选中态']}></TagCheck>
              <TagCheck variant={item} defaultChecked size="large" content={['已选中态', '未选中态']}></TagCheck>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CheckeableDemo;
