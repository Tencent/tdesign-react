import React from 'react';
import { Switch, Space } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

export default function SwitchBasic() {
  const renderActiveContent = () => <Icon name="check" />;
  const renderInactiveContent = () => <Icon name="close" />;
  return (
    <Space direction="vertical">
      <Space>
        <Switch size="large" label={['开', '关']} />
        <Switch size="large" defaultValue label={['开', '关']} />
      </Space>
      <Space>
        <Switch size="large" label={[renderActiveContent(), renderInactiveContent()]} />
        <Switch size="large" defaultValue label={[renderActiveContent(), renderInactiveContent()]} />
      </Space>
    </Space>
  );
}
