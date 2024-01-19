import React from 'react';
import { Descriptions, Space, Switch } from 'tdesign-react';

export default function Colon() {
  const [checked, setChecked] = React.useState(false);

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
      <Space align="center">
        <Switch size="large" value={checked} onChange={setChecked} />
        显示引号
      </Space>
      <Descriptions items={items} title="Shipping address" bordered colon={checked} />
    </Space>
  );
}
