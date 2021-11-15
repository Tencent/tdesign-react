import React from 'react';
import {
  Dropdown, Button, Message,
} from 'tdesign-react';

export default function BasicDropdown() {
  const options = Array.from({ length: 20 }).map((v, k) => ({
    content: `选项${k + 1}`,
    value: k + 1,
  }));
  const clickHandler = (data) => {
    Message.success(`选中【${data.value}】`);
  };
  return (
    <Dropdown options={options} onClick={clickHandler} maxHeight={400} minColumnWidth={90}>
      <Button>
        hover我试试
      </Button>
    </Dropdown>
  );
}
