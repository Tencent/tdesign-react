import React, { useState } from 'react';
import { MessagePlugin, TagInput } from 'tdesign-react';

export default function TagInputMaxExample() {
  const [tags] = useState([]);
  const onEnter = (value, { inputValue }) => {
    if (value.length >= 3 && inputValue) {
      MessagePlugin.warning('最多只能输入 3 个标签!');
    }
  };
  return (
    <div style={{ width: '100%' }}>
      <TagInput defaultValue={tags} placeholder="最多只能输入 3 个标签" max={3} onEnter={onEnter} />
    </div>
  );
}
