import React, { useState, useEffect } from 'react';
import { SelectInput, Radio, Checkbox } from 'tdesign-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const classStyles = `
<style>
.tdesign-demo__pannel-options-multiple {
  width: 100%;
}
.tdesign-demo__pannel-options-multiple .t-checkbox {
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
  const [excessTagsDisplayType, setExcessTagsDisplayType] = useState('break-line');
  const [allowInput, setAllowInput] = useState(true);
  const [creatable, setCreatable] = useState(true);
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
    if (creatable && trigger === 'enter') {
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
    <div className="tdesign-demo__select-input-multiple" style={{ width: '100%' }}>
      <div>
        <Checkbox checked={allowInput} onChange={setAllowInput}>是否允许输入</Checkbox>
        <Checkbox checked={creatable} onChange={setCreatable}>允许创建新选项（Enter 创建）</Checkbox>
      </div>
      <br />
      <div>
        <Radio.Group
          value={excessTagsDisplayType}
          onChange={setExcessTagsDisplayType}
          options={[
            { label: '选中项过多横向滚动', value: 'scroll' },
            { label: '选中项过多换行显示', value: 'break-line' },
          ]}
        />
      </div>
      <br /><br />

      {/* <!-- :popup-props="{ trigger: 'hover' }" --> */}
      <SelectInput
        value={value}
        allowInput={allowInput}
        placeholder={allowInput ? '请选择或输入' : '请选择'}
        tagInputProps={{ excessTagsDisplayType }}
        popupProps={{ overlayStyle: { maxHeight: '280px', overflow: 'auto' } }}
        // label={<span>多选：</span>}
        panel={<Checkbox.Group
          value={checkboxValue}
          options={options}
          className="tdesign-demo__pannel-options-multiple"
          onChange={onCheckedChange}
        />}
        suffixIcon={<ChevronDownIcon />}
        clearable
        multiple
        onTagChange={onTagChange}
      ></SelectInput>
    </div>
  );
}
