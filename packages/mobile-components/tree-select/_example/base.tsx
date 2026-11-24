import React, { useState } from 'react';
import { TreeSelect, TdTreeSelectProps, TreeSelectValue } from 'tdesign-mobile-react';

export default function BaseBadge() {
  const chineseNumber = '一二三四五六七八九十'.split('');

  const generateTree = (deep = 0, count = 10, prefix = ''): TdTreeSelectProps['options'] => {
    const ans: TdTreeSelectProps['options'] = [];

    for (let i = 0; i < count; i += 1) {
      const value = prefix ? `${prefix}-${i}` : `${i}`;
      const rect = {
        label: `选项${chineseNumber[i]}`,
        value,
      };

      if (deep > 0) {
        // @ts-ignore
        rect.children = generateTree(deep - 1, 10, value);
      }
      ans.push(rect);
    }

    return ans;
  };
  const options = generateTree(1);
  const [value, setValue] = useState<TreeSelectValue>(['1', '1-0']);
  const onChange: TdTreeSelectProps['onChange'] = (itemValue, level) => {
    console.log(itemValue, level);
    setValue(itemValue);
  };

  return (
    <>
      <TreeSelect value={value} options={options} onChange={onChange}></TreeSelect>
    </>
  );
}
