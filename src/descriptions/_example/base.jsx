import React from 'react';
import { Descriptions, Space } from 'tdesign-react';

export default function BasicDescriptions() {
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
  return (
    <Space direction="vertical">
      <h3>推荐：数据写法</h3>
      <Descriptions items={items} title="Shipping address" />
      <h3>JSX写法</h3>
      <Descriptions title="Shipping address">
        <Descriptions.Item label="Name">TDesign</Descriptions.Item>
        <Descriptions.Item label="Telephone Number">139****0609</Descriptions.Item>
        <Descriptions.Item label="Area">China Tencent Headquarters</Descriptions.Item>
        <Descriptions.Item label="Address" content="test">
          Shenzhen Penguin Island D1 4A Mail Center
        </Descriptions.Item>
      </Descriptions>
    </Space>
  );
}
