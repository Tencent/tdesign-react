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
      <Drawer
        footer={
          <>
            <Button theme="primary" onClick={handleClose}>
              确定
            </Button>
            <Button onClick={handleClose}>取消</Button>
          </>
        }
        size="large"
        visible={visible}
        onClose={handleClose}
      >
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
