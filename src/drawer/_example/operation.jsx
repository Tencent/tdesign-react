import React, { useState } from 'react';
import { Drawer, Button, Input } from '@tencent/tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Button theme="primary" onClick={handleClick}>
        Open
      </Button>
      <Drawer visible={visible} onClose={handleClose}>
        <div>
          <span>Label A</span>
          <Input />
        </div>
        <div>
          <span>Label b</span>
          <Input />
        </div>
      </Drawer>
    </div>
  );
}
