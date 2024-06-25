import React from 'react';
import { Dropdown, Button, MessagePlugin } from 'tdesign-react';

export default function BasicDropdown() {
  const options = Array.from({ length: 20 }).map((v, k) => ({
    content: `选项${k + 1}`,
    value: k + 1,
  }));
  const clickHandler = (data) => {
    MessagePlugin.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options} onClick={clickHandler} maxHeight={400} minColumnWidth={'90px'}>
      <Button>hover我试试</Button>
    </Dropdown>
  );
}
