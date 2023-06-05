import React, { useState } from 'react';
import { Space, Select, Input, Divider } from 'tdesign-react';

const { Option } = Select;

const options = [];
for (let i = 0; i < 10000; i++) {
  options.push({ label: `选项${i + 1}`, value: String(i) });
}
function VirtualScroll() {
  const [currentOptions, setCurrentOptions] = useState(options);

  const handleOnSearch = (v) => {
    const filteredOptions = options.filter((item) => item.label.indexOf(v) !== -1);
    setCurrentOptions(filteredOptions);
  };

  return (
    <Space>
      {/* 开启虚拟滚动 请为select的panel设定好height 通过popupProps进行透传  */}
      <Select
        options={currentOptions}
        style={{ width: '300px' }}
        scroll={{ type: 'virtual' }}
        popupProps={{ overlayInnerStyle: { height: '300px' } }}
        panelTopContent={
          <div
            style={{
              position: 'sticky',
              backgroundColor: 'var(--td-bg-color-container)',
              top: 0,
              zIndex: 10,
              padding: 6,
            }}
          >
            <Input
              placeholder="请输入关键词搜索"
              onChange={handleOnSearch}
              style={{ width: 'calc(100% - 4px)', margin: '0 auto' }}
            />
            <Divider style={{ margin: '8px 0 0' }} />
          </div>
        }
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
