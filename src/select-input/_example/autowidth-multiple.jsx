import React, { useState, useEffect, useMemo } from 'react';
import { SelectInput, Checkbox } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__panel-options-borderless-multiple {
  width: 100%;
  display: block;
  padding: 4px 0;
}
.tdesign-demo__panel-options-borderless-multiple .t-checkbox {
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
  margin: 0;
  margin-bottom: 4px;
}

.tdesign-demo__panel-options-borderless-multiple .t-checkbox:hover {
  background-color: var(--td-bg-color-container-hover);
}
</style>
`;

const OPTIONS = [
  // 全选
  { label: 'all frameworks', checkAll: true },
  { label: 'tdesign-vue', value: 1 },
  { label: 'tdesign-react', value: 2 },
  { label: 'tdesign-miniprogram', value: 3 },
  { label: 'tdesign-angular', value: 4 },
  { label: 'tdesign-mobile-vue', value: 5 },
  { label: 'tdesign-mobile-react', value: 6 },
];

export default function SelectInputAutocomplete() {
  const [options, setOptions] = useState(OPTIONS);
  const [value, setValue] = useState([
    { label: 'Vue', value: 1 },
    { label: 'React', value: 2 },
    { label: 'Miniprogram', value: 3 },
  ]);

  const checkboxValue = useMemo(() => {
    const arr = [];
    // 此处不使用 forEach，减少函数迭代
    for (let i = 0, len = value.length; i < len; i++) {
      value[i].value && arr.push(value[i].value);
    }
    return arr;
  }, [value]);

  // 直接 checkboxgroup 组件渲染输出下拉选项
  const onCheckedChange = (val, { current, type }) => {
    // current 不存在，则表示操作全选
    if (!current) {
      setValue(type === 'check' ? options.slice(1) : []);
      return;
    }
    // 普通操作
    if (type === 'check') {
      const option = options.find((t) => t.value === current);
      setValue(value.concat(option));
    } else {
      setValue(value.filter((v) => v.value !== current));
    }
  };

  // 可以根据触发来源，自由定制标签变化时的筛选器行为
  const onTagChange = (currentTags, context) => {
    console.log(currentTags, context);
    const { trigger, index, item } = context;
    if (trigger === 'clear') {
      setValue([]);
    }
    if (['tag-remove', 'backspace'].includes(trigger)) {
      setValue(value.filter((v, i) => i !== index));
    }
    // 如果允许创建新条目
    if (trigger === 'enter') {
      const current = { label: item, value: item };
      setValue(value.concat(current));
      setOptions(options.concat(current));
    }
  };

  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  // 如果需要输入框宽度自适应，可以使用 autoWidth
  return (
    <div className="tdesign-demo__select-input-borderless-multiple" style={{ width: '100%' }}>
      <SelectInput
        value={value}
        minCollapsedNum={1}
        autoWidth
        allowInput
        placeholder="select frameworks"
        clearable
        multiple
        onTagChange={onTagChange}
        suffixIcon={<ChevronDownIcon />}
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
