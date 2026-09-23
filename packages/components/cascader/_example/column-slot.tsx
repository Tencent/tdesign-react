import React, { useState } from 'react';
import { Cascader, Input } from 'tdesign-react';

import type { CascaderProps, CascaderValue } from 'tdesign-react';

const options = [
  {
    label: '北京市',
    value: 'beijing',
    children: [
      {
        label: '东城区',
        value: 'dongcheng',
        children: [
          { label: '安定门街道', value: 'andingmen' },
          { label: '建国门街道', value: 'jianguomen' },
          { label: '东直门街道', value: 'dongzhimen' },
        ],
      },
      { label: '西城区', value: 'xicheng' },
      { label: '朝阳区', value: 'chaoyang' },
      { label: '海淀区', value: 'haidian' },
    ],
  },
  {
    label: '上海市',
    value: 'shanghai',
    children: [
      { label: '黄浦区', value: 'huangpu' },
      { label: '徐汇区', value: 'xuhui' },
      { label: '浦东新区', value: 'pudong' },
    ],
  },
  {
    label: '广东省',
    value: 'guangdong',
    children: [
      { label: '广州市', value: 'guangzhou' },
      { label: '深圳市', value: 'shenzhen' },
      { label: '珠海市', value: 'zhuhai' },
    ],
  },
];

export default function Example() {
  const [value, setValue] = useState<CascaderValue>('');
  const [searchValues, setSearchValues] = useState<Record<number, string>>({});

  const onChange: CascaderProps['onChange'] = (nextValue) => {
    setValue(nextValue);
  };

  return (
    <Cascader
      value={value}
      options={options}
      onChange={onChange}
      placeholder="请选择地区"
      columnHeader={({ panelIndex, onFilter }) => (
        <div style={{ padding: '8px' }}>
          <Input
            value={searchValues[panelIndex] || ''}
            placeholder={`搜索第 ${panelIndex + 1} 级`}
            clearable
            onChange={(inputValue) => {
              setSearchValues((previous) => ({
                ...previous,
                [panelIndex]: inputValue,
              }));
              onFilter(inputValue);
            }}
          />
        </div>
      )}
      columnFooter={({ options: columnOptions, filteredOptions }) => (
        <div
          style={{
            padding: '4px 8px',
            color: 'var(--td-text-color-placeholder)',
            textAlign: 'center',
          }}
        >
          {filteredOptions.length} / {columnOptions.length} 项
        </div>
      )}
    />
  );
}
