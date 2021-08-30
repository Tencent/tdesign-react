import React, { useState } from 'react';
import { Tag, DiscountIcon, AddIcon, Input } from '@tencent/tdesign-react';

export default function ClosableTagExample() {
  const [inputVisible, toggleInputVisible] = useState(false);
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

  const handleClickAdd = () => {
    toggleInputVisible(true);
  };

  const handleInputEnter = (value) => {
    toggleInputVisible(false);
    if (value) setTagList((currentList) => currentList.concat([{ name: value, showClose: true }]));
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <span style={{ marginRight: 30 }}>可删除：</span>
        {tagList.map((tag, i) => (
          <Tag
            key={i}
            closable
            onClose={() => {
              deleteTag(i);
            }}
            icon={tag.icon}
            disabled={tag.disabled}
            style={{ marginRight: 30 }}
          >
            {tag.name}
            {i}
          </Tag>
        ))}
      </div>
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        <span style={{ marginRight: 30 }}>可添加：</span>
        {inputVisible ? (
          <Input onBlur={handleInputEnter} onEnter={handleInputEnter} style={{ width: '94px' }} />
        ) : (
          <Tag onClick={handleClickAdd}>
            <AddIcon />
            可添加标签
          </Tag>
        )}
      </div>
    </>
  );
}
