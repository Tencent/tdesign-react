import React from 'react';
import { Dropdown, Button, Message } from '@tencent/tdesign-react';
import { Icon } from '@tencent/tdesign-icons-react';

export default function BasicDropdown() {
  const getContent = () => <div>操作四</div>;
  const options = [
    {
      content: '操作一',
      value: 1,
    },
    {
      content: '操作二',
      value: 2,
    },
    {
      content: '操作三',
      value: 3,
      divider: true,
    },
    {
      content: getContent(),
      value: 4,
    },
  ];
  const clickHandler = (data) => {
    Message.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options} onClick={clickHandler}>
      <Button variant="text">
        <span style={{ display: 'inline-flex' }}>
          更多
          <Icon name="chevron-down" size="16" />
        </span>
      </Button>
    </Dropdown>
  );
}
