import React, { useState } from 'react';
import { Cell, Rate } from 'tdesign-mobile-react';

export default function Special() {
  const [value, setValue] = useState(3);
  const texts = ['非常糟糕', '有些糟糕', '可以尝试', '可以前往', '推荐前往'];

  return (
    <Cell
      style={{
        overflow: 'initial',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <Rate
        size="30"
        texts={texts}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
      <div className={value > 3 ? 'desc desc--active' : 'desc'}>{texts[value - 1]}</div>
    </Cell>
  );
}
