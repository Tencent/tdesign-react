import React, { useState } from 'react';
import { Drawer, Button } from 'tdesign-react';

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
        Open a Drawer
      </Button>
      <Drawer header="这是标题" visible={visible} onClose={handleClose}>
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
