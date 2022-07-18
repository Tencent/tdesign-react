import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';

export default function TagInputStatusExample() {
  const [tags1, setTags1] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags2, setTags2] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags3, setTags3] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags4, setTags4] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags5, setTags5] = useState(['Vue', 'React', 'Miniprogram']);
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space align="baseline">
        <label>禁用状态：</label>
        <TagInput value={tags1} onChange={setTags1} disabled />
      </Space>

      <Space align="baseline">
        <label>只读状态：</label>
        <TagInput value={tags2} onChange={setTags2} tips="这是普通文本提示" readonly />
      </Space>

      <Space align="baseline">
        <label>成功状态：</label>
        <TagInput value={tags3} onChange={setTags3} status="success" tips="校验通过文本提示" clearable />
      </Space>

      <Space align="baseline">
        <label>告警状态：</label>
        <TagInput value={tags4} onChange={setTags4} status="warning" tips="校验不通过文本提示" clearable />
      </Space>

      <Space align="baseline">
        <label>错误状态：</label>
        <TagInput value={tags5} onChange={setTags5} status="error" tips="校验存在严重问题文本提示" clearable />
      </Space>
    </Space>
  );
}
