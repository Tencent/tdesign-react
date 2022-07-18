import React, { useState } from 'react';
import { TagInput } from 'tdesign-react';

const TagInputAutoWidth = () => {
  const [tags, setTags] = useState(['Vue', 'React']);

  const onChange = (val) => {
    setTags(val);
  };
  return <TagInput value={tags} onChange={onChange} autoWidth clearable />;
};

TagInputAutoWidth.displayName = 'TagInputAutoWidth';

export default TagInputAutoWidth;
