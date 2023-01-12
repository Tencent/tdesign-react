import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';
import { ErrorCircleFilledIcon } from 'tdesign-icons-react';

export default function BasicUsage() {
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
        Open Modal
      </Button>
      <Dialog
        header={
          <>
            <ErrorCircleFilledIcon />
            <span>我是主要信息，我是主要信息</span>
          </>
        }
        visible={visible}
        onClose={handleClose}
      ></Dialog>
    </>
  );
}
