import React, { useState } from 'react';
import { TagInput, Popup, Tag, Space } from 'tdesign-react';
import type { TagInputValue } from 'tdesign-react';

export default function TagInputCollapsedExample() {
  const [tags, setTags] = useState<TagInputValue>(['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter']);
  const renderCollapsedItems = ({ collapsedSelectedItems }) => (
    <Popup
      key={'tags'}
      content={collapsedSelectedItems.map((item: string) => (
        <Tag key={item} style={{ marginRight: '4px' }}>
          {item}
        </Tag>
      ))}
    >
      <Tag>More({collapsedSelectedItems?.length})</Tag>
    </Popup>
  );
  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <TagInput value={tags} onChange={setTags} minCollapsedNum={1} />
      <TagInput value={tags} onChange={setTags} minCollapsedNum={3} collapsedItems={renderCollapsedItems}></TagInput>
    </Space>
  );
}
