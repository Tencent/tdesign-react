import React, { useState } from 'react';
import { Drawer, Button } from '@tencent/tdesign-react';

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
      <Drawer header="标题名称" visible={visible} onClose={handleClose} showOverlay={false}>
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
