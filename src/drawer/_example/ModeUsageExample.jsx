import React, { useState } from 'react';
import { Drawer, Radio, Button } from '@tencent/tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Radio.Group value={placement} onChange={(value) => setPlacement(value)}>
        <Radio.Button name="left">left</Radio.Button>
        <Radio.Button name="right">right</Radio.Button>
        <Radio.Button name="top">top</Radio.Button>
        <Radio.Button name="bottom">bottom</Radio.Button>
      </Radio.Group>

      <Button theme="primary" onClick={handleClick} style={{ marginLeft: 16 }}>
        Open
      </Button>
      <Drawer placement={placement} key={placement} title="Drawer" visible={visible} onClose={handleClose} mode="push">
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
