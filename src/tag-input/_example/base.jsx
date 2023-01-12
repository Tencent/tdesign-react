import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputBaseExample() {
  const [tags1, setTags1] = useState(['Vue', 'React', 'Angular']);
  const [tags2] = useState(['Vue', 'React']);
  const [tags3] = useState(['Vue', 'React']);

  const onTagInputEnter = (val, context) => {
    console.log(val, context);
  };

  const onChange = (val, context) => {
    console.log(val, context);
    setTags1(val);
  };

  const onPaste = (context) => {
    console.log(context);
  };

  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <TagInput
        value={tags1}
        onChange={onChange}
        clearable
        onPaste={onPaste}
        onEnter={onTagInputEnter}
        placeholder="请输入"
      />
      <TagInput value={tags2} label="Controlled: " placeholder="请输入" clearable />
      <TagInput defaultValue={tags3} label="UnControlled: " placeholder="请输入" clearable />
    </Space>
  );
}
