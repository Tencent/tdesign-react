import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputThemeExample() {
  const [tags, setTags] = useState(['Vue', 'React', 'Miniprogram']);
  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'primary' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'success' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'warning' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'danger' }} />
    </Space>
  );
}
