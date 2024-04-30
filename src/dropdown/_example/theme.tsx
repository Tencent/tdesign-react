import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';

export default function ThemeDropdown() {
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
      value: 3,
      children: [
        {
          content: '选项十',
          value: 10,
        },
      ],
    },
    {
      content: '危险操作',
      value: 4,
      theme: 'error',
      children: [
        {
          content: '危险操作一',
          value: 11,
          theme: 'error',
          children: [
            {
              content: '危险操作项',
              value: 13,
              theme: 'error',
            },
            {
              content: '操作项',
              value: 12,
            },
          ],
        },
      ],
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options.concat()} onClick={clickHandler} trigger="click">
      <Button variant="text" suffix={<Icon name="chevron-down" size="16" />}>
        更多
      </Button>
    </Dropdown>
  );
}
