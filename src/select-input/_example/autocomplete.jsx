import React, { useState } from 'react';
import { SelectInput } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';

const OPTIONS = ['Student A', 'Student B', 'Student C', 'Student D', 'Student E', 'Student F'];

export default function SelectInputAutocomplete() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectValue, setSelectValue] = useState();
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
          <ul className="tdesign-demo__selet-input-ul">
            {options.map(item => (
              <li v-for="item in options" key={item} onClick={() => onOptionClick(item)}>
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
