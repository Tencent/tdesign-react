import React, { useState } from 'react';
import { Tag, Space } from 'tdesign-react';

const { CheckTag } = Tag;

export default function CheckTagExample() {
  const [checked, onChange] = useState(false);

  return (
    <Space>
      <CheckTag defaultChecked={true}>选中</CheckTag>
      <CheckTag checked={checked} onChange={onChange}>
        未选
      </CheckTag>
      <CheckTag disabled={true}>禁用</CheckTag>
    </Space>
  );
}
