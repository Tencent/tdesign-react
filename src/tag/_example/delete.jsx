import React, { useState } from 'react';
import { Tag, DiscountIcon } from '@tencent/tdesign-react';

export default function ClosableTagExample() {
  const [tagList, setTagList] = useState([
    {
      name: '可删除标签',
      showClose: true,
    },
    {
      name: '可删除标签',
      icon: <DiscountIcon />,
      showClose: true,
    },
    {
      name: '可删除标签',
      showClose: true,
      disabled: true,
    },
  ]);

  /**
   * @param {number} i
   */
  const deleteTag = (i) => {
    const newtagList = [...tagList];
    newtagList.splice(i, 1);
    setTagList(newtagList);
  };

  return (
    <div style={{ display: 'flex' }}>
      <span style={{ marginRight: '10px' }}>可删除</span>
      {tagList.map((tag, i) => (
        <Tag
          key={i}
          closable
          onClose={() => {
            deleteTag(i);
          }}
          icon={tag.icon}
        >
          {tag.name}
        </Tag>
      ))}
    </div>
  );
}
