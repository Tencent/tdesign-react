import React, { useState } from 'react';
import { Dialog, Button } from 'tdesign-react';

export default function PositionExample() {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('center');
  const [topData, setTopData] = useState('');
  const [visible1, setVisible1] = useState(false);

  const handleClick = (placement) => {
    setVisible(true);
    setPlacement(placement);
    setTopData('');
  };
  const handleClose = () => {
    setVisible(false);
  };
  const handleClose1 = () => {
    setVisible1(false);
  };
  return (
    <>
      <Button theme="primary" onClick={() => handleClick('center')} style={{ marginRight: 16 }}>
        默认
      </Button>
      <Button theme="primary" onClick={() => handleClick('top')} style={{ marginRight: 16 }}>
        顶部
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible(true);
          setTopData('100');
        }}
        style={{ marginRight: 16 }}
      >
        自定义
      </Button>
      <Button
        theme="primary"
        onClick={() => {
          setVisible1(true);
          setTopData('100px');
        }}
      >
        超出屏幕
      </Button>

      <Dialog
        header="位置演示"
        visible={visible}
        top={topData}
        showOverlay
        zIndex={2000}
        placement={placement}
        onClose={handleClose}
        onOpened={() => {
          console.log('dialog is open');
        }}
        onClosed={() => {
          console.log('dialog is closed');
        }}
      >
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
      </Dialog>
      <Dialog
        header="位置演示"
        visible={visible1}
        showOverlay
        zIndex={2000}
        onClose={handleClose1}
        onOpened={() => {
          console.log('dialog is open');
        }}
        onClosed={() => {
          console.log('dialog is closed');
        }}
      >
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
        <p>This is a dialog</p>
      </Dialog>
    </>
  );
}
