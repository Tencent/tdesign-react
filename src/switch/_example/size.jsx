import React from 'react';
import { Switch } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  return (
    <div style={{ margin: 20 }}>
      <Switch size="large" />
      <Switch defaultValue size="large" />
      <br />
      <br />
      <Switch size="default" />
      <Switch defaultValue />
      <br />
      <br />
      <Switch size="small" />
      <Switch defaultValue size="small" />
    </div>
  );
}
