import React, { useState } from 'react';
import { TreeSelect, UserIcon } from '@tencent/tdesign-react';

const options = [{
  label: '开发一组',
  value: 'group1',
  children: [{
    label: '小赵',
    value: 'zhao',
  }, {
    label: '小钱',
    value: 'qian',
  }],
}, {
  label: '开发二组',
  value: 'group2',
  children: [{
    label: '小孙',
    value: 'sun',
  }, {
    label: '小李',
    value: 'li',
  }],
}];

export default function Example() {
  const [value, setValue] = useState('');

  return (
    <div style={{ width: 300 }}>
      <TreeSelect
        data={options}
        clearable
        placeholder="请输入"
        value={value}
        prefixIcon={<UserIcon />}
        onChange={(val) => {
          setValue(val);
          console.log(val)
        }}
      />
    </div>
  );
}
