import React from 'react';
import { Switch } from 'tdesign-react';

export default function SwitchBasic() {
  return (
    <div className="tdesign-demo-block-row">
      <Switch size="large" />
      <Switch size="large" loading />
      <Switch size="large" defaultValue loading />
    </div>
  );
}
