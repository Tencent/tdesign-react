import React, { useState, useEffect } from 'react';
import { SelectInput, Checkbox } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__panel-options-borderless-multiple {
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tdesign-demo__panel-options-borderless-multiple .t-checkbox {
  display: flex;
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
  margin: 0;
}

.tdesign-demo__panel-options-borderless-multiple .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
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
      <SelectInput
        allowInput
        borderless
        clearable
        multiple
        value={value}
        minCollapsedNum={1}
        placeholder="select frameworks"
        suffixIcon={<ChevronDownIcon />}
        onTagChange={onTagChange}
        panel={
          <Checkbox.Group
            value={checkboxValue}
            options={options}
            className="tdesign-demo__panel-options-borderless-multiple"
            onChange={onCheckedChange}
          />
        }
      />
    </div>
  );
}
