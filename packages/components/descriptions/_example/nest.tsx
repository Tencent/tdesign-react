import React from 'react';
import { Descriptions, Space } from 'tdesign-react';

// const { DescriptionsItem } = Descriptions;

export default function Nest() {
  const itemsContent = [
    {
      label: 'City',
      content: 'Shenzhen',
    },
    {
      label: 'Detail',
      content: 'Penguin Island D1 4A Mail Center',
    },
  ];

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
      content: <Descriptions items={itemsContent} labelStyle={{ background: '#f4f4f4' }} colon />,
    },
  ];
  return (
    <Space direction="vertical">
      <Descriptions items={items} title="Shipping address" bordered />
      {/* <Descriptions title="Shipping address" bordered>
        <DescriptionsItem label="Name">TDesign</DescriptionsItem>
        <DescriptionsItem label="Telephone Number">139****0609</DescriptionsItem>
        <DescriptionsItem label="Area">China Tencent Headquarters</DescriptionsItem>
        <DescriptionsItem label="Address">
          <Descriptions labelStyle={{ background: '#f4f4f4' }} colon>
            <DescriptionsItem label="City">Shenzhen</DescriptionsItem>
            <DescriptionsItem label="Detail">Penguin Island D1 4A Mail Center</DescriptionsItem>
          </Descriptions>
        </DescriptionsItem>
      </Descriptions> */}
    </Space>
  );
}
