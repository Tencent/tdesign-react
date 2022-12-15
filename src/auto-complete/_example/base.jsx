import React, { useEffect, useState } from 'react';
import { Space, AutoComplete, Button } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.t-demo-auto-complete__base .t-input {
  padding-right: 0;
}
.t-demo-auto-complete__base .t-button svg {
  font-size: 20px;
}
</style>
`;

let timer = null;
const AutoCompleteBase = () => {
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [options, setOptions] = useState(['第一个默认联想词', '第二个默认联想词', '第三个默认联想词']);
  const [options2] = useState(['第一个默认联想词', '第二个默认联想词', '第三个默认联想词']);

  // 输入框内容发生变化时进行搜索，100ms 搜索一次
  const onChange = (val) => {
    setValue(val);
    clearTimeout(timer);
    timer = setTimeout(() => {
      const text = '搜索联想词';
      const pureValue = val.replace(`第一个${text}`, '').replace(`第二个${text}`, '').replace(`第三个${text}`, '');
      setOptions([
        `${pureValue}第一个${text}`,
        `${pureValue}第二个${text}`,
        `${pureValue}第三个${text}`
      ]);
      clearTimeout(timer);
    }, 100);
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <Space direction="vertical" className="t-demo-auto-complete__base" style={{ width: '100%' }}>
      <AutoComplete
        value={value}
        options={options}
        onChange={onChange}
        highlightKeyword
        filterable={false}
        placeholder="请输入关键词搜索"
      />

      {/* 左侧图标可以使用 label，同 input */}
      <AutoComplete
        value={value2}
        options={options2}
        onChange={setValue2}
        highlightKeyword
        filterable
        placeholder="请输入关键词搜索（自定义右侧图标）"
        inputProps={{
          suffix: <Button shape="square"><SearchIcon /></Button>,
        }}
      />
    </Space>
  );
};

AutoCompleteBase.displayName = 'AutoCompleteBase';

export default AutoCompleteBase;
