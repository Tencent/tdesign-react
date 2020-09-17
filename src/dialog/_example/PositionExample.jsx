import React, { useState } from 'react';
import { Dialog, Button } from '@tdesign/react';

export default function PositionExample() {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('center');
  const [offset, setOffset] = useState();

  const handleClick = (placement) => {
    setVisible(true);
    setPlacement(placement);
    setOffset(undefined);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <div>
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
            setPlacement('center');
            setOffset({
              top: '30%',
              left: '20%',
            });
          }}
        >
          自定义
        </Button>
      </div>
      <Dialog
        header="位置演示"
        visible={visible}
        showOverlay
        zIndex={2000}
        placement={placement}
        offset={offset}
        onClickCancel={handleClose}
        onClickConfirm={handleClose}
        onClickCloseBtn={handleClose}
        onOpened={() => {
          console.log('dialog is open');
        }}
        onClosed={() => {
          console.log('dialog is closed');
        }}
      >
        <p>This is a dialog</p>
      </Dialog>
    </div>
  );
}
