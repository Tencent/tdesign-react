import React, { useState } from 'react';
import { Dialog, Button } from '@tencent/tdesign-react';
import { ErrorCircleFilledIcon } from '@tencent/tdesign-react';
export default function BasicUsage() {
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
        Open Modal
      </Button>
      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon size="2em" />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visible}
        onClose={handleClose}
      ></Dialog>
    </div>
  );
}
