import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

export default function LeftDropdown() {
  const options = [
    {
      content: '选项一',
      value: 1,
      children: [
        {
          content: '选项九',
          value: 9,
        },
      ],
    },
    {
      content: '选项二',
      value: 2,
      children: [
        {
          content: '选项五',
          value: 5,
        },
        {
          content: '选项六',
          value: 6,
          children: [
            {
              content: '选项七',
              value: 7,
            },
            {
              content: '选项八',
              value: 8,
            },
          ],
        },
      ],
    },
    {
      content: '选项三',
      value: 3,
      children: [
        {
          content: '选项十',
          value: 10,
        },
      ],
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options} onClick={clickHandler} direction="left" popupProps={{ placement: 'bottom-right' }}>
      <Button variant="text" suffix={<Icon name="chevron-down" size="16" />}>
        更多
      </Button>
    </Dropdown>
  );
}
