import React from 'react';
import { Descriptions, Space, Radio } from 'tdesign-react';

export default function Size() {
  const [size, setSize] = React.useState('medium');

  const sizeOptions = ['large', 'medium', 'small'];
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
      <Radio.Group options={sizeOptions} value={size} onChange={setSize} variant="default-filled" />
      <Descriptions items={items} title="Shipping address" bordered size={size} />
    </Space>
  );
}
