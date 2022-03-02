import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';

const TagInputAutoWidth = () => {
  const [tags, setTags] = useState(['Vue', 'React']);

    const onChange = (val) => {
      setTags(val);
    };
  return (
    <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
      <TagInput value={tags} onChange={onChange} autoWidth clearable />
    </div>
  )
}

TagInputAutoWidth.displayName = 'TagInputAutoWidth';

export default TagInputAutoWidth;
