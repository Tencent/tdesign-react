import React from 'react';
import { Checkbox } from '@tdesign/react';

export default function CheckboxControlledExample() {
  return (
    <>
      <Checkbox value={false}>未选中</Checkbox>
      <Checkbox value>已选中</Checkbox>
      <Checkbox value={false} disabled>
        禁用未选中
      </Checkbox>
      <Checkbox value disabled>
        禁用已选中
      </Checkbox>
      <Checkbox indeterminate>半选状态</Checkbox>
      <Checkbox indeterminate disabled>
        半选状态已禁用
      </Checkbox>
    </>
  );
}
