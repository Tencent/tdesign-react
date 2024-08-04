import React from 'react';
import { Space, Cascader, Tag } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

const SingleValueDisplay: CascaderProps['valueDisplay'] = ({ value, selectedOptions }) =>
  value ? (
    <div>
      <img
        src={selectedOptions?.[0]?.avatar}
        style={{
          width: '16px',
          height: '16px',
          marginTop: '2px',
          verticalAlign: '-4px',
          marginRight: '4px',
        }}
      />
      <span>{selectedOptions?.[0]?.label}</span>
      <span>({value as string})</span>
    </div>
  ) : null;

const MultipleValueDisplay: CascaderProps['valueDisplay'] = ({ selectedOptions, onClose }) =>
  Array.isArray(selectedOptions) && selectedOptions.length
    ? selectedOptions.map((option, index) => (
        <Tag key={option.value} closable onClose={() => onClose(index)}>
          <img
            src={option.avatar}
            style={{
              width: '16px',
              height: '16px',
              marginTop: '2px',
              verticalAlign: '-4px',
              marginRight: '4px',
            }}
          />
          <span>{option.label}</span>
          <span>({option.value})</span>
        </Tag>
      ))
    : null;

export default function Example() {
  const [value1, setValue1] = React.useState<CascaderValue>('2.2');
  const [value2, setValue2] = React.useState<CascaderValue>(['1.3', '2.1', '2.2']);

  const AVATAR = 'https://tdesign.gtimg.com/site/avatar.jpg';

  const optionsData = [
    {
      label: '选项一',
      value: '1',
      children: [
        {
          label: '子选项一',
          value: '1.1',
          avatar: AVATAR,
        },
        {
          label: '子选项二',
          value: '1.2',
          avatar: AVATAR,
        },
        {
          label: '子选项三',
          value: '1.3',
          avatar: AVATAR,
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
          avatar: AVATAR,
        },
        {
          label: '子选项二',
          value: '2.2',
          avatar: AVATAR,
        },
      ],
    },
  ];

  return (
    <Space direction="vertical">
      <Cascader
        value={value1}
        label="单选："
        options={optionsData}
        valueDisplay={SingleValueDisplay}
        onChange={(val) => setValue1(val)}
        clearable
      ></Cascader>

      <Cascader
        value={value2}
        label="多选："
        options={optionsData}
        valueDisplay={MultipleValueDisplay}
        onChange={(val) => setValue2(val)}
        clearable
        multiple
        style={{ width: '500px' }}
      ></Cascader>
    </Space>
  );
}
