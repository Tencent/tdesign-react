import React, { useState } from 'react';
import { Select, Space, RadioGroup, Checkbox, Popup, Tag } from 'tdesign-react';

import type { SelectProps } from 'tdesign-react';

const options = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];

const MultipleSelect = () => {
  const [value, setValue] = useState(['1', '3']);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadOnly] = useState(false);
  const [minCollapsedNum] = useState(1);

  const onChange = (value: string[]) => {
    setValue(value);
  };

  const renderCollapsedItems: SelectProps['collapsedItems'] = ({ collapsedSelectedItems, onClose }) => (
    <Popup
      key={'tags'}
      overlayInnerStyle={{
        padding: '5px',
      }}
      content={
        <Space size={5} align="center">
          {collapsedSelectedItems.map((item, index) => (
            <Tag
              key={index}
              size={size}
              disabled={disabled}
              closable={!readonly && !disabled}
              onClose={(context) => onClose({ e: context.e, index: minCollapsedNum + index })}
            >
              {item.label}
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
    <Space breakLine style={{ width: '100%' }}>
      <h3>default:</h3>
      <Select
        value={value}
        onChange={onChange}
        multiple
        style={{ width: '40%' }}
        options={options}
        minCollapsedNum={1}
      />

      <h3>use collapsedItems:</h3>
      <Space align="center">
        <div>size control:</div>
        <RadioGroup
          value={size}
          options={['small', 'medium', 'large']}
          onChange={(value: 'small' | 'medium' | 'large') => setSize(value)}
        />
      </Space>
      <Space align="center">
        <span>disabled control:</span>
        <Checkbox checked={disabled} onChange={(value) => setDisabled(value)} />
      </Space>
      <Space align="center">
        <span>readonly control:</span>
        <Checkbox checked={readonly} onChange={(value) => setReadOnly(value)} />
      </Space>
      <Select
        value={value}
        onChange={onChange}
        multiple
        style={{ width: '40%' }}
        options={options}
        minCollapsedNum={minCollapsedNum}
        collapsedItems={renderCollapsedItems}
        size={size}
        disabled={disabled}
        readonly={readonly}
      />
    </Space>
  );
};

export default MultipleSelect;
