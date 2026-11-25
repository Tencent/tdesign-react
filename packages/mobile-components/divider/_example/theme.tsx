import React from 'react';
import { Divider } from 'tdesign-mobile-react';

export default function Theme() {
  return (
    <div>
      <Divider dashed />
      <Divider dashed content="文字信息" align="left" />
      <Divider dashed content="文字信息" />
      <Divider dashed content="文字信息" align="right" />
    </div>
  );
}
