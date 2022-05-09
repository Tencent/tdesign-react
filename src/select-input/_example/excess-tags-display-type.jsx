import React, { useState, useEffect } from 'react';
import { SelectInput, Checkbox } from 'tdesign-react';

const classStyles = `
<style>
.tdesign-demo__panel-options-excess {
  width: 100%;
  display: block;
  padding: 12px
}
.tdesign-demo__panel-options-excess .t-checkbox {
  display: block;
  width: 100%
}
</style>
`;

const OPTIONS = [
  // 全选
  { label: 'Check All', checkAll: true },
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

export default function SelectInputExcessTagsDisplayType() {
  const [options, setOptions] = useState([...OPTIONS]);
  const [value, setValue] = useState(OPTIONS.slice(1));

  const checkboxValue = (() => {
    const arr = [];
    const list = value;
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = list.length; i < len; i++) {
      list[i].value && arr.push(list[i].value);
    }
    return arr;
  })();

  // 直接 checkboxgroup 组件渲染输出下拉选项，自定义处理可以避免顺序和 tagChange 冲突
  const onCheckedChange = (val, { current, type }) => {
    // current 不存在，则表示操作全选
    if (!current) {
      const newValue = type === 'check' ? options.slice(1) : [];
      setValue(newValue);
      return;
    }
    // 普通操作
    if (type === 'check') {
      const option = options.find((t) => t.value === current);
      setValue(value.concat(option));
    } else {
      const newValue = value.filter((v) => v.value !== current);
      setValue(newValue);
    }
  };

  // 可以根据触发来源，自由定制标签变化时的筛选器行为
  const onTagChange = (currentTags, context) => {
    const { trigger, index, item } = context;
    if (trigger === 'clear') {
      setValue([]);
    }
    if (['tag-remove', 'backspace'].includes(trigger)) {
      const newValue = [...value];
      newValue.splice(index, 1);
      setValue(newValue);
    }
    // 如果允许创建新条目
    if (trigger === 'enter') {
      const current = { label: item, value: item };
      const newValue = [...value];
      setValue(newValue.concat(current));
      setOptions(options.concat(current));
    }
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  return (
    <div className="tdesign-demo__select-input-multiple" style={{ width: 'width: 100%' }}>
      {/* <!-- excessTagsDisplayType: 'scroll'，超出时，滚动显示 --> */}
      <p>第一种呈现方式：超出时滚动显示</p>
      <br />
      <SelectInput
        value={value}
        tagInputProps={{ excessTagsDisplayType: 'scroll' }}
        placeholder="请选择"
        allowInput
        clearable
        multiple
        onTagChange={onTagChange}
        panel={
          <Checkbox.Group
            value={checkboxValue}
            options={options}
            className="tdesign-demo__panel-options-excess"
            onChange={onCheckedChange}
          />
        }
      ></SelectInput>

      <br />
      <br />
      <br />

      {/* <!-- excessTagsDisplayType: 'scroll'，超出时，换行显示 --> */}
      <p>第二种呈现方式：超出时换行显示</p>
      <br />
      <SelectInput
        value={value}
        tagInputProps={{ excessTagsDisplayType: 'break-line' }}
        placeholder="请选择"
        allowInput
        clearable
        multiple
        onTagChange={onTagChange}
        panel={
          <Checkbox.Group
            value={checkboxValue}
            options={options}
            className="tdesign-demo__panel-options-excess"
            onChange={onCheckedChange}
          />
        }
      ></SelectInput>
    </div>
  );
}
