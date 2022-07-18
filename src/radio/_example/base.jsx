import React from 'react';
import { Radio, Space } from 'tdesign-react';

export default function RadioControlledExample() {
  return (
    <Space>
      <Radio checked={false}>未选中</Radio>
      <Radio allowUncheck={true}>取消选中</Radio>
      <Radio checked>已选中</Radio>
      <Radio checked={false} disabled>
        禁用未选中
      </Radio>
      <Radio checked={true} disabled>
        禁用已选中
      </Radio>
    </Space>
  );
}
