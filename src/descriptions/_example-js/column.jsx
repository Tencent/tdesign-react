import React from 'react';
import { Descriptions, Space, Radio } from 'tdesign-react';

export default function Column() {
  const [column, setColumn] = React.useState(2);

  const columnOptions = [2, 3, 4];

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
      <Radio.Group options={columnOptions} value={column} onChange={setColumn} variant="default-filled" />
      <Descriptions items={items} title="Shipping address" bordered column={column} />
    </Space>
  );
}
