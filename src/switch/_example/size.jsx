import React from 'react';
import { Switch } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  return (
    <div className="tdegsin-demo-switch">
      <Switch size="large" />
      <Switch defaultValue size="large" />
      <br />
      <br />
      <Switch />
      <Switch defaultValue />
      <br />
      <br />
      <Switch size="small" />
      <Switch defaultValue size="small" />
    </div>
  );
}
