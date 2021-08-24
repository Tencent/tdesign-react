import React, { useState } from 'react';
import { InputNumber } from '@tencent/tdesign-react';

export default function InputNumberExample() {
  const [value, setValue] = useState(0);

  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <InputNumber
          size="small"
          max={15}
          min={-12}
          value={value}
          onChange={(value) => {
            console.log(value);
            setValue(value);
          }}
        />
        <InputNumber
          max={15}
          min={-12}
          value={value}
          onChange={(value) => {
            console.log(value);
            setValue(value);
          }}
        />
        <InputNumber
          size="large"
          max={15}
          min={-12}
          value={value}
          onChange={(value) => {
            console.log(value);
            setValue(value);
          }}
        />
      </div>

      <div className="tdesign-demo-block-row">
        <InputNumber defaultValue={5} theme="column" onChange={console.log} />
        <InputNumber defaultValue={10} size="large" theme="column" onChange={console.log} />
      </div>
    </div>
  );
}
