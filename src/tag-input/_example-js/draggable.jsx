import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputBaseExample() {
  const [tags1, setTags1] = useState(['Vue', 'React', 'Angular']);
  const [tags2, setTags2] = useState(['Vue', 'React', 'Angular', 'Miniprogram']);

  const onTagInputEnter = (val, context) => {
    console.log(val, context);
  };

  const onChange = (val, context) => {
    console.log(val, context);
    setTags1(val);
  };

  const onChange2 = (val, context) => {
    console.log(val, context);
    setTags2(val);
  };

  const onPaste = (context) => {
    console.log(context);
  };

  function onDragSort({ currentIndex, targetIndex }) {
    const temp = tags1[currentIndex];
    tags1[currentIndex] = tags1[targetIndex];
    tags1[targetIndex] = temp;
    setTags1([...tags1]);
  }

  function onDragSort2({ currentIndex, targetIndex }) {
    const temp = tags2[currentIndex];
    tags2[currentIndex] = tags2[targetIndex];
    tags2[targetIndex] = temp;
    setTags2([...tags2]);
  }

  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <TagInput
        value={tags1}
        onChange={onChange}
        clearable
        dragSort
        onPaste={onPaste}
        onEnter={onTagInputEnter}
        onDragSort={onDragSort}
        placeholder="请输入"
      />

      <TagInput
        value={tags2}
        dragSort
        clearable
        excessTagsDisplayType="break-line"
        label="Controlled: "
        onChange={onChange2}
        onDragSort={onDragSort2}
        placeholder="请输入"
      />
    </Space>
  );
}
