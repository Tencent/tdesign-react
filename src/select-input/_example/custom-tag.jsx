import React, { useState, useEffect } from 'react';
import { SelectInput, Tag } from 'tdesign-react';
import { ControlPlatformIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__select-input-ul-single {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tdesign-demo__select-input-ul-single > li {
  display: block;
  border-radius: 3px;
  line-height: 22px;
  cursor: pointer;
  padding: 3px 8px;
  color: var(--td-text-color-primary);
  transition: background-color 0.2s linear;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tdesign-demo__select-input-ul-single > li:hover {
  background-color: var(--td-bg-color-container-hover);
}

.tdesign-demo-select-input-custom-tag .tdesign-demo-select-input__img {
  font-size: 16px;
  margin-right: 4px;
}

.tdesign-demo__select-empty-custom {
  text-align: center;
  color: var(--td-text-color-disabled);
  line-height: 32px;
}
.displaySpan {
  line-height: 24px;
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

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <div className="tdesign-demo-select-input-custom-tag">
      {/* <!-- 单选，使用 valueDisplay 定义选中的某一项的内容 --> */}
      <SelectInput
        value={selectValue1}
        placeholder="Please Select"
        clearable
        valueDisplay={
          selectValue1 && (
            <span className="displaySpan">
              <ControlPlatformIcon className="tdesign-demo-select-input__img" />
              {selectValue1.label}
            </span>
          )
        }
        panel={
          <ul className="tdesign-demo__select-input-ul-single">
            {OPTIONS.map((item) => (
              <li key={item.value} onClick={() => onOptionClick(item)}>
                {item.label}
              </li>
            ))}
          </ul>
        }
        onClear={onClear}
      />

      <br />
      <br />

      {/* <!-- 多选，第一种方式：使用 tag 定义选中的某一项的内容 --> */}
      <SelectInput
        value={selectValue2}
        placeholder="Please Select"
        multiple
        tag={({ value }) => (
          <span className="displaySpan">
            <ControlPlatformIcon /> {value}
          </span>
        )}
        panel={<div className="tdesign-demo__select-empty-custom">暂无示意数据</div>}
        onTagChange={onTagChange2}
      />

      <br />
      <br />

      {/* <!-- 多选，第二种方式：使用 valueDisplay 定义全部选中项的内容 --> */}
      <SelectInput
        value={selectValue3}
        placeholder="Please Select"
        multiple
        valueDisplay={({ value, onClose }) =>
          value.map((item, index) => (
            <Tag key={item} closable style={{ marginRight: '4px' }} onClose={() => onClose(index)}>
              <span className="displaySpan">
                <ControlPlatformIcon /> {value}
              </span>
            </Tag>
          ))
        }
        panel={<div className="tdesign-demo__select-empty-custom">暂无示意数据</div>}
        onTagChange={onTagChange3}
      />
    </div>
  );
};

SelectInputCustomTag.displayName = 'SelectInputCustomTag';

export default SelectInputCustomTag;
