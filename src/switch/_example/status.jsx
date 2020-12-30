import React from 'react';
import { Switch } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  return (
    <div style={{ margin: 20 }}>
      <Switch />
      <Switch loading />
      <Switch defaultValue loading />
    </div>
  );
}
