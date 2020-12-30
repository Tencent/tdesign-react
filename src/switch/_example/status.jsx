import React from 'react';
import { Switch } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  return (
    <div className="tdegsin-demo-switch">
      <Switch />
      <Switch loading />
      <Switch defaultValue loading />
    </div>
  );
}
