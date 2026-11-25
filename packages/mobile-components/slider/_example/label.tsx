import React, { useState } from 'react';
import { Slider } from 'tdesign-mobile-react';

export default function LabelDemo() {
  const [value, setValue] = useState(10);

  const onChange = (value: number) => {
    setValue(value);
  };

  return (
    <>
      <div className="wrapper-label">
        <Slider label value={value} onChange={onChange} />
      </div>
      <div className="wrapper-label">
        <Slider range showExtremeValue defaultValue={[20, 60]} label={value} />
      </div>
    </>
  );
}
