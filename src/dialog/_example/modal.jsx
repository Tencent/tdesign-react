import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';

export default function NotModalExample() {
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState('modal');
  
  const handleClick = () => {
    setVisible(true);
    setModal('modal');
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <div>
        <Button theme="primary" onClick={handleClick} style={{ marginRight: 16 }}>
          模态对话框
        </Button>
        <Button
          theme="primary"
          onClick={() => {
            setVisible(true);
            setModal('modeless');
          }}
          style={{ marginRight: 16 }}
        >
          非模态框
        </Button>
        <Button theme="primary" 
          onClick={() => {
            setVisible(true);
            setModal('normal');
          }}>
          普通对话框
        </Button>
      </div>
      <Dialog
        mode={modal}
        placement="top"
        header="对话框"
        draggable="{draggable}"
        visible={visible}
        onClose={handleClose}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
    </div>
  );
}
