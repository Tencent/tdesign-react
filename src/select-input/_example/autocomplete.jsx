import React, { useState, useEffect } from 'react';
import { SelectInput } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__selet-input-ul-autocomplete,
.tdesign-demo__selet-input-ul-autocomplete > li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tdesign-demo__selet-input-ul-autocomplete > li {
  line-height: 40px;
  min-width: 200px;
  padding: 0 8px;
}

.tdesign-demo__selet-input-ul-autocomplete > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.tdesign-demo__selet-input-ul-autocomplete > li > img {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
`;

const OPTIONS = ['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F'];

export default function SelectInputAutocomplete() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [options, setOptions] = useState(OPTIONS);

  const onOptionClick = (item) => {
    setSelectValue(item);
    setPopupVisible(false);
  };

  const onInputChange = (keyword) => {
    setSelectValue(keyword);
    const options = new Array(5).fill(null).map((t, index) => `${keyword} Student ${index}`);
    setOptions(options);
  };

  const onPopupVisibleChange = (val) => {
    setPopupVisible(val);
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  // 如果需要输入框宽度自适应，可以使用 autoWidth
  return (
    <div>
      <SelectInput
        value={selectValue}
        popupVisible={popupVisible}
        placeholder="请输入任意关键词"
        allowInput
        clearable
        style={{ width: '300px' }}
        onInputChange={onInputChange}
        onPopupVisibleChange={onPopupVisibleChange}
        panel={
          <ul className="tdesign-demo__selet-input-ul-autocomplete">
            {options.map(item => (
              <li key={item} onClick={() => onOptionClick(item)}>
                <img src="/favicon.ico" /> { item }
              </li>
            ))}
          </ul>
        }
        suffixIcon={<SearchIcon />}
      ></SelectInput>
    </div>
  )
}
