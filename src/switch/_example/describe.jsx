import React from 'react';
import { Switch, Icon, Row, Col } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  const renderActiveContent = () => <Icon name="check" />;
  const renderInactiveContent = () => <Icon name="close" />;
  return (
    <div className="tdegsin-demo-switch">
      <Row gutter={32}>
        <Col span={2}>
          <Switch size="large" label={['开', '关']} />
        </Col>
        <Col span={2}>
          <Switch size="large" defaultValue label={['开', '关']} />
        </Col>
      </Row>

      <Row gutter={32}>
        <Col span={2}>
          <Switch size="large" label={[renderActiveContent(), renderInactiveContent()]} />
        </Col>
        <Col span={2}>
          <Switch size="large" defaultValue label={[renderActiveContent(), renderInactiveContent()]} />
        </Col>
      </Row>
    </div>
  );
}
