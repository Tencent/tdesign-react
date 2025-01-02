import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputMaxRowExample() {
  const [tags, setTags] = useState<string[]>([
    'Vue',
    'React',
    'Angular',
    'Svelte',
    'Solid',
    'MiniProgram',
    'Flutter',
    'UniApp',
    'Html5',
    'Css3',
    'JavaScript',
    'TypeScript',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'C++',
  ]);

  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <h3>最大高度为2</h3>
      <TagInput
        size="small"
        maxRows={2}
        value={tags}
        onChange={(val) => setTags(val.map(String))}
        clearable
        onPaste={(context) => console.log(context)}
        onEnter={(val, context) => console.log(val, context)}
        label="小尺寸: "
        placeholder="最大高度为2行，超出部分滚动显示"
      />

      <h3>最大高度为3</h3>
      <TagInput
        maxRows={3}
        value={tags}
        onChange={(val) => setTags(val.map(String))}
        label="中等尺寸: "
        clearable
        placeholder="最大高度为3行，超出部分滚动显示"
      />

      <h3>最大高度为4</h3>
      <TagInput
        size="large"
        maxRows={4}
        value={tags}
        onChange={(val) => setTags(val.map(String))}
        label="大尺寸: "
        clearable
        placeholder="最大高度为4行，超出部分换行显示"
      />
    </Space>
  );
}
