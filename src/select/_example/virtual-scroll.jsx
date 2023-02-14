import React from 'react';
import { Space, Select } from 'tdesign-react';

const { Option } = Select;

const options = [];
for (let i = 0; i < 10000; i++) {
  options.push({ label: `选项${i + 1}`, value: String(i) });
}
function VirtualScroll() {
  return (
    <Space>
      {/* 开启虚拟滚动 请为select的panel设定好height 通过popupProps进行透传  */}
      <Select
        options={options}
        style={{ width: '300px' }}
        scroll={{ type: 'virtual' }}
        popupProps={{ overlayInnerStyle: { height: '300px' } }}
      />
      <Select
        options={options}
        style={{ width: '300px' }}
        scroll={{ type: 'virtual' }}
        popupProps={{ overlayInnerStyle: { height: '300px' } }}
      >
        {options.map((item, index) => (
          <Option key={index} label={item.label} value={item.value}></Option>
        ))}
      </Select>
    </Space>
  );
}

export default VirtualScroll;
