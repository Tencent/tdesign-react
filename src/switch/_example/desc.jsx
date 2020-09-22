import React from 'react';
import { Switch, Icon } from '@tdesign/react';

export default function SwitchBasic() {
  const renderActiveContent = () => <Icon name="tick" />;
  const renderInactiveContent = () => <Icon name="close" />;
  return (
    <div style={{ margin: 20 }}>
      <Switch activeContent="开" inactiveContent="关" />
      <Switch defaultValue activeContent="开" inactiveContent="关" />
      <br />
      <br />
      <Switch activeContent={renderActiveContent()} inactiveContent={renderInactiveContent()} />
      <Switch defaultValue activeContent={renderActiveContent()} inactiveContent={renderInactiveContent()} />
    </div>
  );
}
