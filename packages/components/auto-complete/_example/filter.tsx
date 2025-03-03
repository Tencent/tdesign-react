import React, { useState } from 'react';
import { Space, AutoComplete } from 'tdesign-react';
import type { AutoCompleteProps } from 'tdesign-react';
import { escapeRegExp } from 'lodash-es';

const LIST = ['第一个 AutoComplete 默认联想词', '第二个 AutoComplete 默认联想词', '第三个 AutoComplete 默认联想词'];

const AutoCompleteBaseFilter = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');

  const filterWords: AutoCompleteProps['filter'] = (keyword, option: string) => {
    const regExp = new RegExp(escapeRegExp(keyword));
    return regExp.test(option);
  };

  return (
    <Space style={{ width: '100%' }}>
      <AutoComplete
        value={value1}
        options={[...LIST]}
        onChange={setValue1}
        highlightKeyword
        filterable
        placeholder="组件默认过滤规则（不区分大小写）"
        style={{ width: '280px' }}
      />

      <AutoComplete
        value={value2}
        options={[...LIST]}
        onChange={setValue2}
        highlightKeyword
        filter={filterWords}
        placeholder="组件默认过滤规则（不区分大小写）"
        style={{ width: '280px' }}
      />
    </Space>
  );
};

AutoCompleteBaseFilter.displayName = 'AutoCompleteBaseFilter';

export default AutoCompleteBaseFilter;
