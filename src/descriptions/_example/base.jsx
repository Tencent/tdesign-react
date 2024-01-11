import React from 'react';
import { Descriptions, Space } from 'tdesign-react';

const { DescriptionsItem } = Descriptions;

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
        <DescriptionsItem label="Name">TDesign</DescriptionsItem>
        <DescriptionsItem label="Telephone Number">139****0609</DescriptionsItem>
        <DescriptionsItem label="Area">China Tencent Headquarters</DescriptionsItem>
        <DescriptionsItem label="Address" content="test">
          Shenzhen Penguin Island D1 4A Mail Center
        </DescriptionsItem>
      </Descriptions>
    </Space>
  );
}
