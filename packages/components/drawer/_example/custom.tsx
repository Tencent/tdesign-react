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
    <>
      <Button theme="primary" onClick={handleClick}>
        打开抽屉
      </Button>
      <Drawer
        header={<div>自定义头部</div>}
        body={<div>自定义内容</div>}
        footer={<Button theme="primary">自定义底部按钮</Button>}
        visible={visible}
        onClose={handleClose}
      ></Drawer>
    </>
  );
}
