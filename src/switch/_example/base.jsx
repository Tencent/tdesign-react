import React, { useState } from 'react';
import { Switch } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  const [checked, setChecked] = useState(true);

  const onChange = (value) => {
    setChecked(value);
  };

  return (
    <div className="tdegsin-demo-switch">
      <Switch />
      <Switch value={checked} onChange={onChange} />
    </div>
  );
}
