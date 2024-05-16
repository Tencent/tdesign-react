import React, { useState } from 'react';
import { Cascader, Checkbox, Tag, Space, RadioGroup, Popup } from 'tdesign-react';

export default function Example() {
  const [value, setValue] = useState(['1.1', '1.2', '1.3']);
  const [size, setSize] = useState('medium');
  const [disabled, setDisabled] = useState(false);
  const [readonly, setReadOnly] = useState(false);
  const [minCollapsedNum] = useState(1);

  const options = [
    {
      label: '选项一',
      value: '1',
      children: [
        {
          label: '子选项一',
          value: '1.1',
        },
        {
          label: '子选项二',
          value: '1.2',
        },
        {
          label: '子选项三',
          value: '1.3',
        },
      ],
    },
    {
      label: '选项二',
      value: '2',
      children: [
        {
          label: '子选项一',
          value: '2.1',
        },
        {
          label: '子选项二',
          value: '2.2',
        },
      ],
    },
  ];

  const onChange = (value) => {
    setValue(value);
  };

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
    <Space direction="vertical">
      <h3>default:</h3>
      <Cascader options={options} value={value} onChange={onChange} multiple minCollapsedNum={1} />

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
      <Cascader
        options={options}
        value={value}
        onChange={onChange}
        multiple
        minCollapsedNum={minCollapsedNum}
        collapsedItems={renderCollapsedItems}
        size={size}
        disabled={disabled}
        readonly={readonly}
      />
    </Space>
  );
}
