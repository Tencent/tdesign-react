import React, { useEffect, useRef, useState } from 'react';
import { AddIcon, DiscountIcon } from 'tdesign-icons-react';
import { Input, Space, Tag } from 'tdesign-react';

import type { InputRef } from 'tdesign-react';

export default function ClosableTagExample() {
  const [inputVisible, toggleInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);
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

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  /**
   * @param {number} i
   */
  const deleteTag = (i: number) => {
    const newtagList = [...tagList];
    newtagList.splice(i, 1);
    setTagList(newtagList);
  };

  const handleClickAdd = () => {
    toggleInputVisible(true);
  };

  const handleInputEnter = (value: string) => {
    toggleInputVisible(false);
    if (value) setTagList((currentList) => currentList.concat([{ name: value, showClose: true }]));
  };

  return (
    <Space direction="vertical">
      <Space>
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
      </Space>
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {inputVisible ? (
          <Input
            ref={inputRef}
            size="small"
            onBlur={handleInputEnter}
            onEnter={handleInputEnter}
            style={{ width: '94px' }}
          />
        ) : (
          <Tag onClick={handleClickAdd} icon={<AddIcon />}>
            可添加标签
          </Tag>
        )}
      </div>
    </Space>
  );
}
