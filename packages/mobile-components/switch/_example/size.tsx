import React from 'react';
import { Cell, Switch } from 'tdesign-mobile-react';

export default function SwitchSize() {
  return (
    <>
      <Cell title="大尺寸 32" rightIcon={<Switch defaultValue size="large" />}></Cell>
      <Cell title="中尺寸 28" rightIcon={<Switch defaultValue />}></Cell>
      <Cell title="小尺寸 24" rightIcon={<Switch defaultValue size="small" />}></Cell>
    </>
  );
}
