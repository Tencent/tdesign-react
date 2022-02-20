
import React, { useState } from 'react';
import { SelectInput } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';
import './index.less';

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

  const onOptionClick = (item) => {
    setSelectValue(item);
    // 选中后立即关闭浮层
    setPopupVisible(false);
  };

  const onClear = () => {
    setSelectValue(undefined);
  };

  const onPopupVisibleChange = (val, context) => {
    console.log(context);
    setPopupVisible(val);
  };

  return (
    <div>
      {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
      <SelectInput
        value={selectValue}
        popupVisible={popupVisible}
        placeholder="Please Select"
        borderless
        clearable
        onPopupVisibleChange={onPopupVisibleChange}
        clear={onClear}
        panel={
          <ul className="tdesign-demo__selet-input-ul">
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

// 外部样式
// .tdesign-demo__selet-input-ul,
// .tdesign-demo__selet-input-ul > li {
//   list-style: none;
//   padding: 0;
//   margin: 0;
// }

// .tdesign-demo__selet-input-ul > li {
//   line-height: 40px;
//   min-width: 200px;
//   padding: 0 8px;
// }

// .tdesign-demo__selet-input-ul > li:hover {
//   background-color: var(--td-bg-color-container-hover);
// }

// .tdesign-demo__selet-input-ul > li > img {
//   max-width: 20px;
//   max-height: 20px;
//   vertical-align: middle;
//   margin-right: 8px;
// }

// .tdesign-demo__select-input-block {
//   display: flex;
//   align-items: center;
// }

// .tdesign-demo__select-input-block > label {
//   width: 60px;
// }

// .tdesign-demo-select-input-custom-tag img.tdesign-demo-select-input__img {
//   max-width: 18px;
//   max-height: 18px;
//   margin: 0;
//   vertical-align: -4px;
//   margin-right: 4px;
// }

// .tdesign-demo__select-empty {
//   text-align: center;
//   color: var(--td-text-color-disabled);
//   line-height: 32px;
// }
