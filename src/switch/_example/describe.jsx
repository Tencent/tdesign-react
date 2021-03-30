import React from 'react';
import { Switch, Icon } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  const renderActiveContent = () => <Icon name="check" />;
  const renderInactiveContent = () => <Icon name="close" />;
  return (
    <div className="tdegsin-demo-switch">
      <Switch label={['开', '关']} />
      <Switch defaultValue label={['开', '关']} />
      <br />
      <br />
      <Switch label={[renderActiveContent(), renderInactiveContent()]} />
      <Switch defaultValue label={[renderActiveContent(), renderInactiveContent()]} />
    </div>
  );
}
