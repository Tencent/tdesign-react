import React, { useState } from 'react';
import { Switch, Row, Col } from '@tencent/tdesign-react';

export default function SwitchBasic() {
  const [checked, setChecked] = useState(true);

  const onChange = (value) => {
    console.log('value', value);
    setChecked(value);
  };

  return (
    <div className="tdegsin-demo-switch">
      <Row>
        <Col span={2}>
          <Switch size="large" />
        </Col>
        <Col span={2}>
          <Switch size="large" value={checked} onChange={onChange} />
        </Col>
      </Row>
    </div>
  );
}
