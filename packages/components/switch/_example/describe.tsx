import React, { useState } from 'react';
import { Icon } from 'tdesign-icons-react';
import { Space, Switch } from 'tdesign-react';

type Status = 'on' | 'off';

export default function SwitchBasic() {
  const [status, setStatus] = useState<Status>('on');
  const [enabled, setEnabled] = useState(true);

  const handleStatusChange = (value: Status) => {
    console.log('Status:', value);
    setStatus(value);
  };

  const handleEnableChange = (value: boolean) => {
    console.log('Enabled:', value);
    setEnabled(value);
  };

  const renderActiveIcon = () => <Icon name="check" />;
  const renderInactiveIcon = () => <Icon name="close" />;

  return (
    <Space>
      <Switch<Status>
        size="large"
        value={status}
        customValue={['on', 'off']}
        label={['ON', 'OFF']}
        onChange={handleStatusChange}
      />
      <Switch<boolean>
        size="large"
        value={enabled}
        label={[renderActiveIcon(), renderInactiveIcon()]}
        onChange={handleEnableChange}
      />
    </Space>
  );
}
