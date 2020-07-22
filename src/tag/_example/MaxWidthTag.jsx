import React from 'react';
import { Tag } from '../index';

export default function MaxWidthExample() {
  const style = { marginRight: 5, marginBottom: 10 };
  return (
    <>
      <Tag maxWidth={150} theme="primary" style={style}>
        数字{150}************
      </Tag>
      <Tag maxWidth="150" theme="primary" style={style}>
        数字字符150********
      </Tag>
      <Tag maxWidth="150px" theme="primary" style={style}>
        像素字符150px******
      </Tag>
      <Tag maxWidth="30%" theme="primary" style={style}>
        百分比30%******
      </Tag>
    </>
  );
}
