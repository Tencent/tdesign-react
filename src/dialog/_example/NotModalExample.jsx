import React, { useState } from 'react';
import { Dialog, Button } from '@tdesign/react';

export default function NotModalExample() {
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
        mode="not-modal"
        header="非模态框"
        visible={visible}
        onClickCancel={handleClose}
        onClickConfirm={handleClose}
        onClickCloseBtn={handleClose}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
    </div>
  );
}
