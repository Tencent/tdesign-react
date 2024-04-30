import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon, DiscountIcon } from 'tdesign-icons-react';

export default function BasicDropdown() {
  const options = [
    {
      content: '选项一',
      value: 1,
      prefixIcon: <DiscountIcon />,
    },
    {
      content: '选项二',
      value: 2,
      prefixIcon: <DiscountIcon />,
    },
    {
      content: '选项三',
      value: 3,
      prefixIcon: <DiscountIcon />,
    },
    {
      content: '选项四',
      value: 4,
      prefixIcon: <DiscountIcon />,
      children: [
        {
          content: '选项五',
          value: 5,
          prefixIcon: <DiscountIcon />,
        },
        {
          content: '选项六',
          value: 6,
          prefixIcon: <DiscountIcon />,
        },
      ],
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options} onClick={clickHandler}>
      <Button variant="text" suffix={<Icon name="chevron-down" size="16" />}>
        更多
      </Button>
    </Dropdown>
  );
}
