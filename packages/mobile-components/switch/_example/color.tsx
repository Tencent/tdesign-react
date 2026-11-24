import React from 'react';
import { Switch, Cell } from 'tdesign-mobile-react';

export default function SwitchColor() {
  return (
    <>
      <Cell title="自定义颜色开关" rightIcon={<Switch defaultValue={true} className="custom-color" />}></Cell>
    </>
  );
}
