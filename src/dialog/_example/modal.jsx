import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';

export default function NotModalExample() {
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleClose1 = () => {
    setVisible1(false);
  };
  const handleClose2 = () => {
    setVisible2(false);
  };
  const handleClose3 = () => {
    setVisible3(false);
  };
  return (
    <>
      <Button theme="primary" onClick={handleClick} style={{ marginRight: 16 }}>
        模态对话框
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible1(true);
        }}
        style={{ marginRight: 16 }}
      >
        非模态对话框
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible2(true);
        }}
        style={{ marginRight: 16 }}
      >
        非模态对话框2
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible3(true);
        }}
      >
        普通对话框
      </Button>

      <Dialog
        width="800"
        header="模态对话框"
        visible={visible}
        onClose={handleClose}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        mode="modeless"
        header="非模态对话框"
        draggable={true}
        visible={visible1}
        onClose={handleClose1}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        mode="modeless"
        header="非模态对话框2"
        draggable={true}
        visible={visible2}
        onClose={handleClose2}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        mode="normal"
        header="普通对话框"
        visible={visible3}
        onClose={handleClose3}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}
