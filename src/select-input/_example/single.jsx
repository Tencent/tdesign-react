
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
        style={{ width: '300px' }}
        placeholder="Please Select"
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
