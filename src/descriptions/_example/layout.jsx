import React from 'react';
import { Descriptions, Space, Row, Col, Radio } from 'tdesign-react';

export default function Layout() {
  const [layout, setLayout] = React.useState('horizontal');
  const [itemLayout, setItemLayout] = React.useState('horizontal');

  const items = [
    {
      label: 'Name',
      content: 'TDesign',
    },
    {
      label: 'Telephone Number',
      content: '139****0609',
    },
    {
      label: 'Area',
      content: 'China Tencent Headquarters',
    },
    {
      label: 'Address',
      content: 'Shenzhen Penguin Island D1 4A Mail Center',
    },
  ];

  const layoutOptions = ['horizontal', 'vertical'];
  const itemLayoutOptions = ['horizontal', 'vertical'];

  return (
    <Space direction="vertical">
      <Row align="middle">
        <Col>
          <span>layout：</span>
        </Col>
        <Col>
          <Radio.Group variant="default-filled" value={layout} onChange={setLayout} options={layoutOptions} />
        </Col>
      </Row>
      <Row align="middle">
        <Col>
          <span>itemLayout：</span>
        </Col>
        <Col>
          <Radio.Group
            variant="default-filled"
            value={itemLayout}
            onChange={setItemLayout}
            options={itemLayoutOptions}
          />
        </Col>
      </Row>
      <Descriptions items={items} title="Shipping address" bordered layout={layout} itemLayout={itemLayout} />
    </Space>
  );
}
