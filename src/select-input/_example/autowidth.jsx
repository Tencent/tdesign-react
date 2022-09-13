import React, { useState, useEffect } from 'react';
import { SelectInput } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-auto-width {
  padding: 4px 0;
}
.tdesign-demo__select-input-ul-auto-width > li {
  display: block;
  border-radius: 3px;
  height: 40px;
  line-height: 22px;
  cursor: pointer;
  padding: 9px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s cubic-bezier(0.38, 0, 0.24, 1);
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.tdesign-demo__select-input-ul-auto-width > li:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
`;

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

export default function SelectInputAutocomplete() {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectValue, setSelectValue] = useState({ label: 'tdesign-vue', value: 1 });

  const onOptionClick = (item) => {
    setSelectValue(item);
    setPopupVisible(false);
  };

  const onClear = () => {
    setSelectValue(undefined);
  };

  const onPopupVisibleChange = (val, context) => {
    console.log(context);
    setPopupVisible(val);
  };

  const onInputChange = (val, context) => {
    // 过滤功能
    console.log(val, context);
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  // 如果需要输入框宽度自适应，可以使用 autoWidth
  return (
    <SelectInput
      value={selectValue}
      popupVisible={popupVisible}
      placeholder="Please Select"
      clearable
      autoWidth
      allowInput
      onPopupVisibleChange={onPopupVisibleChange}
      onClear={onClear}
      onInputChange={onInputChange}
      suffixIcon={<ChevronDownIcon />}
      panel={
        <ul className="tdesign-demo__select-input-ul-auto-width">
          {OPTIONS.map((item) => (
            <li key={item.value} onClick={() => onOptionClick(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      }
    />
  );
}
