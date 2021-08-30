import React, { useState } from 'react';
import { Tag } from '@tencent/tdesign-react';

const { CheckTag } = Tag;

export default function CheckTagExample() {
  const [checked, onChange] = useState(false);

  return (
    <>
      <CheckTag style={{ marginRight: 30 }} defaultChecked={true}>
        选中
      </CheckTag>
      <CheckTag style={{ marginRight: 30 }} checked={checked} onChange={onChange}>
        未选
      </CheckTag>
      <CheckTag style={{ marginRight: 30 }} disabled={true}>
        Disabled
      </CheckTag>
    </>
  );
}
