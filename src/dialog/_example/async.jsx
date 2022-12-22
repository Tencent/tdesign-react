import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';

export default function BasicUsage() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleCloseAsync = () => {
    setLoading(true);
    setTimeout(() => {
      setVisible(false);
      setLoading(false);
    }, 2000);
  };
  return (
    <>
      <Button theme="primary" onClick={handleClick}>
        Open Modal
      </Button>
      <Dialog
        header="Basic Modal"
        visible={visible}
        confirmBtn={<Button loading={loading}>保存中...</Button>}
        onClose={handleClose}
        onConfirm={handleCloseAsync}
      >
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}
