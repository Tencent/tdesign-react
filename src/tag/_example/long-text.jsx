import React from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function LongText() {
  const style = { marginRight: 5, marginBottom: 10 };
  return (
    <>
      <Tag maxWidth={150} style={style}>
        超长省略文本标签超长省略文本标签
      </Tag>
    </>
  );
}
