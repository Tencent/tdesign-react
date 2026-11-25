import React, { useState } from 'react';
import { Cell, Rate } from 'tdesign-mobile-react';

export default function Count() {
  const [value, setValue] = useState(2);

  return (
    <Cell title="自定义评分数量" style={{ overflow: 'initial' }}>
      <Rate
        count={3}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </Cell>
  );
}
