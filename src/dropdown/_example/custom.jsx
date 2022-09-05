import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';

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
    },
    {
      content: getContent(),
      value: 4,
    },
  ];
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown
      options={options}
      onClick={clickHandler}
      trigger="click"
      popupProps={{ overlayInnerStyle: { padding: 4 } }}
    >
      <Button>点击我试试</Button>
    </Dropdown>
  );
}
