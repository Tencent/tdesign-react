import React, { useState } from 'react';
import { Tag } from '@tencent/tdesign-react';

export default function ClosableTagExample() {
  const style = { marginRight: 5 };
  const [tagList, setTagList] = useState(new Array(3).fill('点击关闭'));

  /**
   * @param {number} i
   */
  const deleteTag = (i) => {
    const newtagList = [...tagList];
    newtagList.splice(i, 1);
    setTagList(newtagList);
  };

  return (
    <>
      {tagList.map((tag, i) => (
        <Tag
          key={i}
          closable
          style={style}
          onClose={() => {
            deleteTag(i);
          }}
        >
          {tag}
          {i}
        </Tag>
      ))}
    </>
  );
}
