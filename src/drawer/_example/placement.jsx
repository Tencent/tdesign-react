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
        <Radio.Button value="left">left</Radio.Button>
        <Radio.Button value="right">right</Radio.Button>
        <Radio.Button value="top">top</Radio.Button>
        <Radio.Button value="bottom">bottom</Radio.Button>
      </Radio.Group>

      <Button theme="primary" onClick={handleClick} style={{ marginLeft: 16 }}>
        Open
      </Button>
      <Drawer placement={placement} key={placement} title="Drawer" visible={visible} onClose={handleClose}>
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
