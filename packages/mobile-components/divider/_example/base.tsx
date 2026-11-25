import React from 'react';
import { Divider } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <>
      <Divider />

      <div className="divider-demo__title">带文字水平分割线</div>
      <Divider content="文字信息" align="left" />
      <Divider content="文字信息" />
      <Divider content="文字信息" align="right" />

      <div className="divider-demo__title" style={{ marginBottom: '10px' }}>
        垂直分割线
      </div>
      <div className="divider-wrapper">
        <span>文字信息</span>
        <Divider layout="vertical" />
        <span>文字信息</span>
        <Divider layout="vertical" />
        <span>文字信息</span>
      </div>
    </>
  );
}
