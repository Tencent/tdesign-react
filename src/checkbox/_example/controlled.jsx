import React, { useState } from 'react';
import { Checkbox } from '@tencent/tdesign-react';

export default function CheckboxExample() {
  const [value, setValue] = useState(false);

  return (
    <div className="tdesign-demo-block-row">
      <Checkbox checked={value} onChange={setValue}>
        受控属性
      </Checkbox>
      <Checkbox defaultChecked={true}>非受控属性</Checkbox>
    </div>
  );
}
