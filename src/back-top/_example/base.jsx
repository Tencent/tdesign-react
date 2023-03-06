// @ts-nocheck
import React from 'react';
import { BackTop } from 'tdesign-react';
import Space from 'tdesign-react/space/Space';

export default function BasicBackTop() {
  const style = {
    position: 'relative',
    insetInlineEnd: 0,
    insetBlockEnd: 0,
  };

  return (
    <Space>
      <BackTop theme="light" style={style} visibleHeight={0} duration={1000} container={() => document} />
      <BackTop theme="primary" style={style} visibleHeight={0} duration={1000} container={() => document} />
      <BackTop theme="dark" style={style} visibleHeight={0} duration={1000} container={() => document} />
    </Space>
  );
}
