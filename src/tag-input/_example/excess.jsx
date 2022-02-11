import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';

export default function TagInputExcessExample() {
  const [tags, setTags] = useState(['Vue', 'React']);
  return (
    <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
      {/* <!-- 标签数量超出时，滚动显示，默认情况 --> */}
      <TagInput
        value={tags}
        onChange={setTags}
        label="Scroll: "
        placeholder="请输入"
        clearable
      />

      {/* <!-- 标签数量超出时，换行显示 --> */}
      <TagInput
        value={tags}
        onChange={setTags}
        label="BreakLine: "
        placeholder="请输入"
        excessTagsDisplayType="break-line"
        clearable
      />
    </div>
  )
}
