import React from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioControlledExample() {
  return (
    <>
      <Radio value={false}>未选中</Radio>
      <Radio value>已选中</Radio>
      <Radio value={false} disabled>
        禁用未选中
      </Radio>
      <Radio value={true} disabled>
        禁用已选中
      </Radio>
    </>
  );
}
