import React from 'react';
import { Tag } from 'tdesign-react';

const { CheckTag } = Tag;

export default function Size() {
  const style = { marginRight: 10 };
  const styleTop = { marginTop: 10 };
  return (
    <>
      <div className="tdesign-demo-block-row">
        <Tag size="small" style={style}>
          小型标签
        </Tag>
        <Tag size="medium" style={style}>
          默认标签
        </Tag>
        <Tag size="large" style={style}>
          大型标签
        </Tag>
      </div>
      <div className="tdesign-demo-block-row" style={styleTop}>
        <CheckTag size="small" style={style}>小型标签</CheckTag>
        <CheckTag size="medium" style={style}>默认标签</CheckTag>
        <CheckTag size="large" style={style}>大型标签</CheckTag>
      </div>
    </>
  );
}
