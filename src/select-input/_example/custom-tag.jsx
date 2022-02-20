import React, { useState } from 'react';
import { SelectInput, Tag } from 'tdesign-react';
import './index.less';

const OPTIONS = [
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

const SelectInputCustomTag = () => {
  const [selectValue1, setSelectValue1] = useState({ label: 'tdesign-vue', value: 1 });
  const [selectValue2, setSelectValue2] = useState(['tdesign-vue', 'tdesign-react']);
  const [selectValue3, setSelectValue3] = useState(['tdesign-vue', 'tdesign-react', 'tdesign-mobile-vue']);

  const onOptionClick = (item) => {
    setSelectValue1(item);
  };

  const onClear = () => {
    setSelectValue1(undefined);
  };

  const onTagChange2 = (val) => {
    setSelectValue2(val);
  };

  const onTagChange3 = (val) => {
    setSelectValue3(val);
  };
  return (
    <div className="tdesign-demo-select-input-custom-tag">
      {/* <!-- 单选，使用 valueDisplay 定义选中的某一项的内容 --> */}
      <SelectInput
        value={selectValue1}
        placeholder="Please Select"
        clearable
        valueDisplay={(
          <span>
            <img src="/favicon.ico" className="tdesign-demo-select-input__img" />
            { selectValue1.label }
          </span>
        )}
        panel={(
          <ul className="tdesign-demo__selet-input-ul">
            {OPTIONS.map(item => (
              <li key={item.value} onClick={() => onOptionClick(item)}>
                <img src="/favicon.ico" /> { item.label }
              </li>
            ))}
          </ul>
        )}
        onClear={onClear}
      ></SelectInput>

      <br /><br />

      {/* <!-- 多选，第一种方式：使用 tag 定义选中的某一项的内容 --> */}
      <SelectInput
        value={selectValue2}
        placeholder="Please Select"
        multiple
        tag={({ value }) => (
          <span key={value}>
            <img src="https://tdesign.gtimg.com/site/avatar.jpg" className="tdesign-demo-select-input__img" />
            { value }
          </span>
        )}
        panel={<div className="tdesign-demo__select-empty">暂无示意数据</div>}
        onTagChange={onTagChange2}
      ></SelectInput>

      <br /><br />

      {/* <!-- 多选，第二种方式：使用 valueDisplay 定义全部选中项的内容 --> */}
      <SelectInput
        value={selectValue3}
        placeholder="Please Select"
        multiple
        valueDisplay={({ value, onClose }) => value.map((item, index) => (
          <Tag
            key={item}
            closable
            style={{ marginRight: '4px' }}
            onClose={() => onClose(index)}
          >
            <img src="https://tdesign.gtimg.com/site/avatar.jpg" className="tdesign-demo-select-input__img" />
            <span>{ item }</span>
          </Tag>
        ))}
        panel={<div className="tdesign-demo__select-empty">暂无示意数据</div>}
        onTagChange={onTagChange3}
      ></SelectInput>
    </div>
  )
}

SelectInputCustomTag.displayName = 'SelectInputCustomTag';

export default SelectInputCustomTag;

// 外部样式
// .tdesign-demo-select-input-custom-tag img.tdesign-demo-select-input__img {
//   max-width: 18px;
//   max-height: 18px;
//   margin: 0;
//   vertical-align: -4px;
//   margin-right: 4px;
// }
