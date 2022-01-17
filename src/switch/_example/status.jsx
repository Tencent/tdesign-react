import React from 'react';
import { Switch } from 'tdesign-react';

export default function SwitchBasic() {
  return (
    <div className="tdesign-demo-block-row">
      <Switch size="large" defaultValue />
      <Switch size="large" defaultValue loading />
      <Switch size="large" disabled />
    </div>
  );
}
