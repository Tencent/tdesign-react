import React, { useState } from 'react';
import { TagInput, Space } from 'tdesign-react';
import type { TagInputProps, TagInputValue } from 'tdesign-react';

export default function TagInputMaxRowExample() {
  const [tags1, setTags1] = useState<TagInputValue>(['Vue', 'React', 'Angular', 'Svelte', 'Solid', 'Preact']);
  const [tags2, setTags2] = useState<TagInputValue>(['Ember', 'Backbone']);
  const [tags3, setTags3] = useState<TagInputValue>(['Alpine', 'Lit']);

  const onTagInputEnter: TagInputProps['onEnter'] = (val, context) => {
    console.log(val, context);
  };

  const onChange1: TagInputProps['onChange'] = (val, context) => {
    console.log(val, context);
    setTags1(val);
  };

  const onChange2: TagInputProps['onChange'] = (val, context) => {
    console.log(val, context);
    setTags2(val);
  };

  const onChange3: TagInputProps['onChange'] = (val, context) => {
    console.log(val, context);
    setTags3(val);
  };

  const onPaste: TagInputProps['onPaste'] = (context) => {
    console.log(context);
  };

  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <h3>Small Size with 2 Max Rows</h3>
      <TagInput
        size="small"
        maxRows={2}
        value={tags1}
        onChange={onChange1}
        excessTagsDisplayType="break-line"
        clearable
        onPaste={onPaste}
        onEnter={onTagInputEnter}
        placeholder="Small Size, Max 2 Rows"
      />

      <h3>Default Size with 3 Max Rows</h3>
      <TagInput
        maxRows={3}
        value={tags2}
        onChange={onChange2}
        excessTagsDisplayType="break-line"
        label="Default Size: "
        clearable
        placeholder="Default Size, Max 3 Rows"
      />

      <h3>Large Size with 4 Max Rows</h3>
      <TagInput
        size="large"
        maxRows={4}
        value={tags3}
        onChange={onChange3}
        excessTagsDisplayType="break-line"
        label="Large Size: "
        clearable
        placeholder="Large Size, Max 4 Rows"
      />
    </Space>
  );
}
