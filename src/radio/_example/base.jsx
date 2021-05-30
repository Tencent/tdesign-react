import React from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioControlledExample() {
  return (
    <>
      <Radio checked={false}>未选中</Radio>
      <Radio checked>已选中</Radio>
      <Radio checked={false} disabled>
        禁用未选中
      </Radio>
      <Radio checked={true} disabled>
        禁用已选中
      </Radio>
    </>
  );
}
