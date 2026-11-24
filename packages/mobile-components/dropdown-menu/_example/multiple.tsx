import React, { useState } from 'react';
import { DropdownItem, DropdownMenu } from 'tdesign-mobile-react';

const chineseNumber = '一二三四五六七八九十'.split('');

const singleColumnOptions = new Array(8).fill(null).map((_, i) => ({
  label: `选项${chineseNumber[i]}`,
  value: `option_${i + 1}`,
  disabled: false,
}));

singleColumnOptions.push({
  label: '禁用选项',
  value: 'disabled',
  disabled: true,
});

const doubleColumnsOptions = [
  ...singleColumnOptions,
  {
    label: '禁用选项',
    value: 'disabled',
    disabled: true,
  },
];

const tripleColumnsOptions = [
  ...doubleColumnsOptions,
  {
    label: '禁用选项',
    value: 'disabled',
    disabled: true,
  },
];

tripleColumnsOptions.splice(8, 0, {
  label: `选项${chineseNumber[8]}`,
  value: `option_${9}`,
  disabled: false,
});

const emptyArr = new Array(10).fill(null);
const options = emptyArr.map((_, i) => ({
  label: '选项名称',
  value: `option_${i + 1}`,
  disabled: false,
}));

options.push({
  label: '禁用选项',
  value: 'disabled-item',
  disabled: true,
});

export default function MultipleDemo() {
  const [singleValue, setSingleValue] = useState(['option_1']);
  const [doubleValue, setDoubleValue] = useState(['option_1', 'option_2']);
  const [tripleValue, setTripleValue] = useState([]);

  return (
    <DropdownMenu>
      <DropdownItem
        label="单列多选"
        keepLabelActive
        multiple
        optionsColumns={1}
        options={singleColumnOptions}
        value={singleValue}
        onChange={(value: string[]) => {
          setSingleValue(value);
        }}
        onReset={() => {
          setSingleValue([]);
        }}
      />
      <DropdownItem
        label="双列多选"
        multiple
        optionsColumns={2}
        options={doubleColumnsOptions}
        value={doubleValue}
        onChange={(value: string[]) => {
          setDoubleValue(value);
        }}
        onReset={() => {
          setDoubleValue([]);
        }}
      />
      <DropdownItem
        label="三列多选"
        keepLabelActive
        multiple
        optionsColumns={3}
        options={tripleColumnsOptions}
        value={tripleValue}
        onChange={(value: string[]) => {
          setTripleValue(value);
        }}
        onReset={() => {
          setTripleValue([]);
        }}
      />
    </DropdownMenu>
  );
}
