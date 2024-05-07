import React, { useState } from 'react';
import { TagInput, Popup, Tag, Space, RadioGroup, Checkbox } from 'tdesign-react';

export default function TagInputCollapsedExample() {
  const [tags, setTags] = useState(['Vue', 'React', 'Miniprogram', 'Angular', 'Flutter']);
  const [size, setSize] = useState('medium');
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadOnly] = useState(false);
  const [minCollapsedNum] = useState(1);

  const renderCollapsedItems = ({ collapsedSelectedItems, onClose }) => (
    <Popup
      key={'tags'}
      overlayInnerStyle={{
        padding: '5px',
      }}
      content={
        <Space size={5} align="center">
          {collapsedSelectedItems.map((item, index) => (
            <Tag
              key={item}
              size={size}
              disabled={disabled}
              closable={!readonly && !disabled}
              onClose={(context) => onClose({ e: context.e, index: minCollapsedNum + index })}
            >
              {item}
            </Tag>
          ))}
        </Space>
      }
    >
      <Tag size={size} disabled={disabled}>
        More({collapsedSelectedItems?.length})
      </Tag>
    </Popup>
  );
  return (
    <Space direction="vertical" style={{ width: '80%' }}>
      <h3>default:</h3>
      <TagInput value={tags} onChange={setTags} minCollapsedNum={1} />
      <h3>use collapsedItems:</h3>
      <Space align="center">
        <div>size control:</div>
        <RadioGroup value={size} options={['small', 'medium', 'large']} onChange={(value) => setSize(value)} />
      </Space>
      <Space align="center">
        <span>disabled control:</span>
        <Checkbox checked={disabled} onChange={(value) => setDisabled(value)} />
      </Space>
      <Space align="center">
        <span>readonly control:</span>
        <Checkbox checked={readonly} onChange={(value) => setReadOnly(value)} />
      </Space>
      <TagInput
        value={tags}
        onChange={(val) => {
          console.log('val', val);
          setTags(val);
        }}
        minCollapsedNum={minCollapsedNum}
        size={size}
        disabled={disabled}
        readonly={readonly}
        collapsedItems={renderCollapsedItems}
      ></TagInput>
    </Space>
  );
}
