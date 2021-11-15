import React from 'react';
import {
  Dropdown, Button, Message,
} from 'tdesign-react';

export default function BasicDropdown() {
  const getContent = () => <div>操作四</div>;
  const options = [
    {
      content: '操作一',
      value: 1,
      onClick: () => Message.success('操作一'),
    },
    {
      content: '操作二',
      value: 2,
      onClick: () => Message.success('操作二'),
    },
    {
      content: '操作三',
      value: 3,
      onClick: () => Message.success('操作三'),
    },
    {
      content: getContent(),
      value: 4,
      onClick: () => Message.success('操作四'),
    },
  ];
  return (
    <Dropdown options={options}>
      <Button>
        hover我试试
      </Button>
    </Dropdown>
  );
}
