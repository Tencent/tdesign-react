import React, { useState } from 'react';
import { Search } from 'tdesign-mobile-react';

export default function MaxLengthDemo() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  return (
    <>
      <div className="search-example">
        <Search value={value1} maxlength={10} placeholder="最多输入10个汉字" onChange={setValue1} />
      </div>
      <div className="search-example">
        <Search value={value2} maxcharacter={10} placeholder="最多输入10个字符（汉字算两个）" onChange={setValue2} />
      </div>
    </>
  );
}
