import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';

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
        header="Basic Modal"
        visible={visible}
        onClose={handleClose}
        preventScrollThrough
      >
        <p style={{ height: '2200px' }}>This is a dialog</p>
      </Dialog>
    </>
  );
}
