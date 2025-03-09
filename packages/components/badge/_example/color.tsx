import React, { useState } from 'react';
import { Badge, Checkbox } from 'tdesign-react';

const colors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
];

export default function BadgeExample() {
  const [dot, setDot] = useState(true);

  return (
    <>
      <Checkbox value={dot} onChange={setDot}>
        红点样式
      </Checkbox>
      <div>
        {colors.map((color) => (
          <Badge color={color} dot={dot} key={color} count={100} />
        ))}
      </div>
    </>
  );
}
