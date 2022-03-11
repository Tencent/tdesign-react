import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';
import './index.less';

export default function TagInputStatusExample() {
  const [tags1, setTags1] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags2, setTags2] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags3, setTags3] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags4, setTags4] = useState(['Vue', 'React', 'Miniprogram']);
  const [tags5, setTags5] = useState(['Vue', 'React', 'Miniprogram']);
  return (
    <div className="tdesign-demo-block-column" style={{ width: '100%' }}>
      <div className="t-tdesign-demo__tag-input">
        <label>禁用状态：</label>
        <TagInput value={tags1} onChange={setTags1} disabled />
      </div>

      <div className="t-tdesign-demo__tag-input">
        <label>只读状态：</label>
        <TagInput value={tags2} onChange={setTags2} tips="这是普通文本提示" readonly />
      </div>

      <div className="t-tdesign-demo__tag-input">
        <label>成功状态：</label>
        <TagInput value={tags3} onChange={setTags3} status="success" tips="校验通过文本提示" clearable />
      </div>

      <div className="t-tdesign-demo__tag-input">
        <label>告警状态：</label>
        <TagInput value={tags4} onChange={setTags4} status="warning" tips="校验不通过文本提示" clearable />
      </div>

      <div className="t-tdesign-demo__tag-input">
        <label>错误状态：</label>
        <TagInput value={tags5} onChange={setTags5} status="error" tips="校验存在严重问题文本提示" clearable />
      </div>
    </div>
  );
}
