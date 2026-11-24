import React, { useState } from 'react';
import { Switch, Cell } from 'tdesign-mobile-react';
import { CheckIcon, CloseIcon } from 'tdesign-icons-react';

export default function SwitchLabel() {
  const [checked, setChecked] = useState(true);

  const onChange = (value: boolean) => {
    console.log('value', value);
    setChecked(value);
  };

  const renderActiveContent = () => <CheckIcon />;
  const renderInactiveContent = () => <CloseIcon />;

  return (
    <>
      <Cell
        title="带文字开关"
        rightIcon={<Switch value={checked} label={({ value }) => (value ? '开' : '关')} onChange={onChange} />}
      ></Cell>
      <Cell
        title="带图标开关"
        rightIcon={<Switch defaultValue label={[renderActiveContent(), renderInactiveContent()]} />}
      ></Cell>
    </>
  );
}
