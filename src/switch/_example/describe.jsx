import React from 'react';
import { Switch, Icon } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  const renderActiveContent = () => <Icon name="check" />;
  const renderInactiveContent = () => <Icon name="close" />;
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Switch size="large" label={['开', '关']} />
        <Switch size="large" defaultValue label={['开', '关']} />
      </div>
      <div className="tdesign-demo-block-row">
        <Switch size="large" label={[renderActiveContent(), renderInactiveContent()]} />
        <Switch size="large" defaultValue label={[renderActiveContent(), renderInactiveContent()]} />
      </div>
    </div>
  );
}
