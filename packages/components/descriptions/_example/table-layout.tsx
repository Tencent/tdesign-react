import React from 'react';
import { Descriptions, Space, Radio, DescriptionsProps } from 'tdesign-react';

export default function Column() {
  const [tableLayout, setTableLayout] = React.useState<DescriptionsProps['tableLayout']>('fixed');

  const tableLayoutOptions = ['fixed', 'auto'];

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
      <Radio.Group
        options={tableLayoutOptions}
        value={tableLayout}
        onChange={(val: DescriptionsProps['tableLayout']) => setTableLayout(val)}
        variant="default-filled"
      />
      <Descriptions items={items} title="Shipping address" bordered tableLayout={tableLayout} />
    </Space>
  );
}
