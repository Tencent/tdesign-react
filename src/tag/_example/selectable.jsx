import React, { useState } from 'react';
import { Tag } from '@tencent/tdesign-react';

const { CheckTag } = Tag;

export default function CheckTagExample() {
  const [checked, onChange] = useState(false);

  return (
    <>
      <CheckTag>标签1</CheckTag>
      <CheckTag defaultChecked={true}>标签2</CheckTag>
      <CheckTag checked={checked} onChange={onChange}>
        标签3
      </CheckTag>
    </>
  );
}
