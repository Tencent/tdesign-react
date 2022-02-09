import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';

export default function TagInputThemeExample() {
  const [tags, setTags] = useState(['Vue', 'React', 'Miniprogram']);
  return (
    <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'primary' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'success' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'warning' }} />
      <TagInput value={tags} onChange={setTags} tagProps={{ theme: 'danger' }} />
    </div>
  );
}
