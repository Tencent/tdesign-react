import React, { useState } from 'react';
import { AutoComplete, Textarea } from 'tdesign-react';

let timer = null;

const AutoCompleteTriggerElement = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([
    'First AutoComplete Textarea',
    'Second AutoComplete Textarea',
    'Third AutoComplete Textarea',
  ]);

  // 输入框内容发生变化时进行搜索，200ms 搜索一次
  function onChange(val) {
    setValue(val);
    clearTimeout(timer);
    timer = setTimeout(() => {
      const text = 'AutoComplete Textarea';
      const pureValue = val.replace(`First ${text}`, '').replace(`Second ${text}`, '').replace(`Third ${text}`, '');
      setOptions([`${pureValue}First ${text}`, `${pureValue}Second ${text}`, `${pureValue}Third ${text}`]);
      clearTimeout(timer);
    }, 200);
  }

  return (
    <AutoComplete
      value={value}
      options={options}
      onChange={onChange}
      highlightKeyword
    >
      <Textarea
        value={value}
        onChange={setValue}
        placeholder="自定义联想词触发元素"
      />
    </AutoComplete>
  );
};

AutoCompleteTriggerElement.displayName = 'AutoCompleteTriggerElement';

export default AutoCompleteTriggerElement;
