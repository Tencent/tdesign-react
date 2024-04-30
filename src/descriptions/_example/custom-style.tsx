import React from 'react';
import { Descriptions } from 'tdesign-react';

export default function CustomStyle() {
  const customLabelClassName = {
    width: '100px',
    textAlign: 'left',
  };
  const customContentClassName = {
    textAlign: 'center',
  };

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
    <Descriptions
      items={items}
      title="Shipping address"
      bordered
      labelStyle={customLabelClassName}
      contentStyle={customContentClassName}
    />
  );
}
