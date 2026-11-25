import React, { useState } from 'react';
import { Cell, Rate } from 'tdesign-mobile-react';

export default function Base() {
  const [value, setValue] = useState(3);

  return (
    <Cell title="实心评分" style={{ overflow: 'initial' }}>
      <Rate
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    </Cell>
  );
}
