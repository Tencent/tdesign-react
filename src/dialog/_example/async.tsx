import React, { useState } from 'react';
import { Dialog, Button, DialogPlugin } from 'tdesign-react';

async function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

export default function BasicUsage() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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

  function showFunctionCallDialog() {
    // 函数调用组件
    const myDialog = DialogPlugin({
      header: 'Basic Modal',
      body: 'This is a dialog',
      onConfirm: async ({ e }) => {
        console.log('confirm clicked', e);
        myDialog.setConfirmLoading(true);
        await delay(3);
        myDialog.setConfirmLoading(false);
        myDialog.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        myDialog.hide();
      },
      onCloseBtnClick: ({ e }) => {
        console.log('close btn: ', e);
      },
    });
  }

  return (
    <>
      <Button theme="primary" onClick={handleClick} style={{ marginRight: 16 }}>
        Open Modal
      </Button>

      <Button theme="primary" onClick={showFunctionCallDialog}>
        Open Plugin Modal
      </Button>

      <Dialog
        header="Basic Modal"
        visible={visible}
        confirmLoading={loading}
        onClose={handleClose}
        onConfirm={handleCloseAsync}
      >
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}
