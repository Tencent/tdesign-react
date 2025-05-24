import React, { useMemo, useState } from 'react';
import { Cascader, Space } from 'tdesign-react';
import type { CascaderProps, CascaderValue } from 'tdesign-react';

const optionRender = ({ item }) => (
  <div className="tdesign-demo__user-option" style={{ display: 'flex' }}>
    <img src="https://tdesign.gtimg.com/site/avatar.jpg" style={{ maxWidth: 28, maxHeight: 28, borderRadius: '50%' }} />
    <div className="tdesign-demo__user-option-info" style={{ marginLeft: 16, lineHeight: '28px' }}>
      <span>{item.label}</span>
    </div>
  </div>
);

const getDeepOptions = (options) => {
  if (!options) return null;
  return options.map((item) => ({
    ...item,
    children: getDeepOptions(item.children),
    // content 自定义下拉选项关键代码
    content: optionRender({ item }),
  }));
};

export default function Example() {
  const [value, setValue] = useState<CascaderValue>([]);
  const [options] = useState([
    {
      label: '选项一',
      value: '1',
      children: [
        {
          label: '子选项一',
          value: '1.1',
        },
        {
          label: '子选项二',
          value: '1.2',
        },
        {
          label: '子选项三',
          value: '1.3',
        },
      ],
    },
    {
      label: '选项二',
      value: '2',
      children: [
        {
          label: '子选项一',
          value: '2.1',
        },
        {
          label: '子选项二',
          value: '2.2',
        },
      ],
    },
  ]);

  const onChange: CascaderProps['onChange'] = (value) => {
    setValue(value);
  };

  const optionsData = useMemo(() => getDeepOptions(options), [options]);

  return (
    <Space direction="vertical">
      {/* 方式一：使用 options 自定义下拉选项内容 */}
      <Cascader options={optionsData} filterable onChange={onChange} value={value} size="medium" clearable />
      {/* 方式二：使用option传参自定义下拉选项内容 */}
      <Cascader
        option={optionRender}
        options={options}
        filterable
        onChange={onChange}
        value={value}
        size="medium"
        clearable
      />
    </Space>
  );
}
