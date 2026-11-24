import React, { useState, useCallback } from 'react';
import { Search } from 'tdesign-mobile-react';

const list = [
  'tdesign-vue',
  'tdesign-react',
  'tdesign-miniprogram',
  'tdesign-angular',
  'tdesign-mobile-vue',
  'tdesign-mobile-react',
];

export default function Base() {
  const [value, setValue] = useState<string>('');
  const [resultList, setResultList] = useState<string[]>([]);

  const onChange = useCallback((val: string, context: any) => {
    console.log('onChange: ', val, context);
    setValue(val);
    if (val) {
      setResultList(list.filter((item) => item.toLowerCase().includes(val.toLowerCase())));
    } else {
      setResultList([]);
    }
  }, []);

  return (
    <div>
      <div className="search-example">
        <Search placeholder="搜索预设文案" />
      </div>
      <div className="search-example">
        <Search value={value} resultList={resultList} placeholder="输入tdesign，有预览效果" onChange={onChange} />
      </div>
    </div>
  );
}
