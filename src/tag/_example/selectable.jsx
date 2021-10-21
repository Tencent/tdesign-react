import React, { useState } from 'react';
import { Tag } from '@tencent/tdesign-react';

const { CheckTag } = Tag;

export default function CheckTagExample() {
  const [checked, onChange] = useState(false);

  return (
    <div className="tdesign-demo-block-row">
      <CheckTag defaultChecked={true}>
        选中
      </CheckTag>
      <CheckTag checked={checked} onChange={onChange}>
        未选
      </CheckTag>
      <CheckTag disabled={true}>
        Disabled
      </CheckTag>
    </div>
  );
}
