import React, { useState } from 'react';
import { TreeSelect, Tag, Space, RadioGroup, Checkbox, Popup } from 'tdesign-react';

const options = [
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      {
        label: '广州市',
        value: 'guangzhou',
      },
      {
        label: '深圳市',
        value: 'shenzhen',
      },
    ],
  },
  {
    label: '江苏省',
    value: 'jiangsu',
    children: [
      {
        label: '南京市',
        value: 'nanjing',
      },
      {
        label: '苏州市',
        value: 'suzhou',
      },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState(['guangzhou', 'shenzhen']);
  const [customizeValue, setCustomizeValue] = useState(['guangzhou', 'shenzhen']);
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
      <TreeSelect
        data={options}
        multiple
        clearable
        placeholder="请选择"
        minCollapsedNum={1}
        value={value}
        onChange={(val) => setValue(val)}
      />

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
      <TreeSelect
        data={options}
        multiple
        clearable
        placeholder="请选择"
        minCollapsedNum={minCollapsedNum}
        collapsedItems={renderCollapsedItems}
        size={size}
        disabled={disabled}
        readonly={readonly}
        value={customizeValue}
        onChange={(val) => setCustomizeValue(val)}
      />
    </Space>
  );
}
