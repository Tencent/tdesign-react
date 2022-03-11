
import React, { useState, useEffect } from 'react';
import { SelectInput } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `

<style>
.tdesign-demo__selet-input-ul-label-suffix,
.tdesign-demo__selet-input-ul-label-suffix > li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tdesign-demo__selet-input-ul-label-suffix > li {
  line-height: 40px;
  min-width: 200px;
  padding: 0 8px;
}

.tdesign-demo__selet-input-ul-label-suffix > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.tdesign-demo__selet-input-ul-label-suffix > li > img {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 8px;
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

export default function SelectInputSingle() {
  // const selectValue = useState('tdesign-vue');
  const [selectValue, setSelectValue] = useState({ label: 'tdesign-vue', value: 1 });
  // const selectValue = useState([{ label: 'tdesign-vue', value: 1 }]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupVisible2, setPopupVisible2] = useState(false);

  const onOptionClick = (item) => {
    setSelectValue(item);
    // 选中后立即关闭浮层
    setPopupVisible(false);
    setPopupVisible2(false);
  };

  const onClear = () => {
    setSelectValue(undefined);
  };

  const onPopupVisibleChange = (val, context) => {
    console.log(context);
    setPopupVisible(val);
  };

  const onPopupVisibleChange2 = (val) => {
    setPopupVisible2(val);
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <div>
      {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
      <SelectInput
        value={selectValue}
        popupVisible={popupVisible}
        style={{ width: '300px' }}
        label={<span>前置内容：</span>}
        placeholder="Please Select"
        clearable
        onPopupVisibleChange={onPopupVisibleChange}
        onClear={onClear}
        panel={
          <ul className="tdesign-demo__selet-input-ul-label-suffix">
            {OPTIONS.map(item => (
              <li key={item.value} onClick={() => onOptionClick(item)}>
                <img src="/favicon.ico" /> { item.label }
              </li>
            ))}
          </ul>
        }
        suffixIcon={<ChevronDownIcon />}
      ></SelectInput>
      <br /> <br />

      <SelectInput
        value={selectValue}
        popupVisible={popupVisible2}
        style={{ width: '300px' }}
        suffix={<span>单位：元</span>}
        placeholder="Please Select"
        clearable
        onPopupVisibleChange={onPopupVisibleChange2}
        clear={onClear}
        panel={
          <ul className="tdesign-demo__selet-input-ul-label-suffix">
            {OPTIONS.map(item => (
              <li key={item.value} onClick={() => onOptionClick(item)}>
                <img src="/favicon.ico" /> { item.label }
              </li>
            ))}
          </ul>
        }
        suffixIcon={<ChevronDownIcon />}
      ></SelectInput>
    </div>
  )
}
