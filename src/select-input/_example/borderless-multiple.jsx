import React, { useState, useEffect } from 'react';
import { SelectInput, Checkbox } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__panel-options-multiple-borderless {
  width: 100%;
  display: block;
}
.tdesign-demo__panel-options-multiple-borderless .t-checkbox {
  display: block;
  margin: 12px;
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

export default function SelectInputMultiple() {
  const [options, setOptions] = useState([...OPTIONS]);
  const [value, setValue] = useState([
    { label: 'Vue', value: 1 },
    { label: 'React', value: 2 },
    { label: 'Miniprogram', value: 3 },
  ]);

  const getCheckboxValue = () => {
    const arr = [];
    const list = value;
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = list.length; i < len; i++) {
      list[i].value && arr.push(list[i].value);
    }
    return arr;
  };

  const checkboxValue = getCheckboxValue();

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
    <div style={{ width: '60%' }}>
      {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
      <SelectInput
        value={value}
        minCollapsedNum={1}
        placeholder="select frameworks"
        // label={<span>多选：</span>}
        panel={<Checkbox.Group
          value={checkboxValue}
          options={options}
          className="tdesign-demo__panel-options-multiple-borderless"
          onChange={onCheckedChange}
        />}
        suffixIcon={<ChevronDownIcon />}
        allowInput
        borderless
        clearable
        multiple
        onTagChange={onTagChange}
      ></SelectInput>
    </div>
  );
}
