import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputSize() {
  const [tags1, setTags1] = useState(['Vue', 'React']);
  const [tags2, setTags2] = useState(['Vue', 'React']);
  const [tags3, setTags3] = useState(['Vue', 'React']);
  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <TagInput value={tags1} onChange={setTags1} size="small" clearable />

      <TagInput value={tags2} onChange={setTags2} clearable />

      <TagInput value={tags3} onChange={setTags3} size="large" clearable />
    </Space>
  );
}
