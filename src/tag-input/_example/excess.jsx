import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';

export default function TagInputExcessExample() {
  const [tags1, setTags1] = useState(['Vue', 'React']);
  const [tags2, setTags2] = useState(['Vue', 'React']);
  return (
    <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
      {/* <!-- 标签数量超出时，滚动显示 --> */}
      <TagInput value={tags1} onChange={setTags1} label="Scroll: " clearable />

      {/* <!-- 标签数量超出时，换行显示 --> */}
      <TagInput
        value={tags2}
        onChange={setTags2}
        label="BreakLine: "
        excess-tags-display-type="break-line"
        clearable
      />
    </div>
  )
}
