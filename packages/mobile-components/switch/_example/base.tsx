import React, { useState } from 'react';
import { Switch, Cell } from 'tdesign-mobile-react';
import type { SwitchValue } from 'tdesign-mobile-react';

export default function SwitchBase() {
  const [checked, setChecked] = useState<SwitchValue>(1);

  const onChange = (value: SwitchValue) => {
    console.log('value', value);
    setChecked(value);
  };

  return (
    <>
      <Cell title="基础开关" rightIcon={<Switch value={checked} customValue={[1, 0]} onChange={onChange} />}></Cell>
    </>
  );
}
