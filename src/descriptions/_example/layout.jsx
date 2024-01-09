import React from 'react';
import { Descriptions, Space } from 'tdesign-react';

export default function Layout() {
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
      <Space direction="vertical">
        <h3>整体左右布局，item 左右布局</h3>
        <Descriptions items={items} title="Shipping address" bordered />
      </Space>

      <Space direction="vertical">
        <h3>整体左右布局，item 上下布局</h3>
        <Descriptions items={items} title="Shipping address" bordered itemLayout="vertical" />
      </Space>

      <Space direction="vertical">
        <h3>整体上下布局，item 左右布局</h3>
        <Descriptions items={items} title="Shipping address" bordered layout="vertical" />
      </Space>

      <Space direction="vertical">
        <h3>整体上下布局，item 上下布局</h3>
        <Descriptions items={items} title="Shipping address" bordered layout="vertical" itemLayout="vertical" />
      </Space>
    </Space>
  );
}
