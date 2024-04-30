import React, { useState } from 'react';
import { Select, Space } from 'tdesign-react';

const SelectPopupProps = () => {
  const [value, setValue] = useState('1');
  const onChange = (value) => {
    setValue(value);
  };
  return (
    <Space>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: '300px', display: 'inline-block' }}
        options={[
          {
            label: '固定300px宽度',
            value: '1',
          },
          {
            label: '选项内容超长超长超长超长超长超长超长超长超长超长超长的选项',
            value: '2',
          },
        ]}
      ></Select>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: '300px' }}
        popupProps={{ overlayInnerStyle: { width: '300px' } }}
        options={[
          {
            label: '下拉框强制和输入框同宽',
            value: '1',
          },
          {
            label: '选项内容超长超长超长超长超长超长超长超长超长超长超长的选项',
            value: '2',
          },
        ]}
      ></Select>
    </Space>
  );
};

export default SelectPopupProps;
