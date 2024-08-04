import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

import type { TagInputProps, TagInputChangeContext } from 'tdesign-react';

export default function TagInputBaseExample() {
  const [tags1, setTags1] = useState(['Vue', 'React', 'Angular']);
  const [tags2, setTags2] = useState(['Vue', 'React', 'Angular', 'Miniprogram']);

  const onTagInputEnter: TagInputProps['onEnter'] = (val, context) => {
    console.log(val, context);
  };

  const onChange = (val: string[], context: TagInputChangeContext) => {
    console.log(val, context);
    setTags1(val);
  };

  const onChange2 = (val: string[], context: TagInputChangeContext) => {
    console.log(val, context);
    setTags2(val);
  };

  const onPaste: TagInputProps['onPaste'] = (context) => {
    console.log(context);
  };

  const onDragSort: TagInputProps['onDragSort'] = ({ currentIndex, targetIndex }) => {
    const temp = tags1[currentIndex];
    tags1[currentIndex] = tags1[targetIndex];
    tags1[targetIndex] = temp;
    setTags1([...tags1]);
  };

  const onDragSort2: TagInputProps['onDragSort'] = ({ currentIndex, targetIndex }) => {
    const temp = tags2[currentIndex];
    tags2[currentIndex] = tags2[targetIndex];
    tags2[targetIndex] = temp;
    setTags2([...tags2]);
  };

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
