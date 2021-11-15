import React, { useState } from 'react';
import { Drawer, Radio, Button, Form } from 'tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [mode, setMode] = useState('push');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div className="tdesign-demo-block-column">
      <div>
        <span>抽屉弹出方向：</span>
        <Radio.Group value={placement} onChange={(value) => setPlacement(value)}>
          <Radio.Button value="left">left</Radio.Button>
          <Radio.Button value="right">right</Radio.Button>
          <Radio.Button value="top">top</Radio.Button>
          <Radio.Button value="bottom">bottom</Radio.Button>
        </Radio.Group>
      </div>

      <div>
        <span>抽屉弹出模式：</span>
        <Radio.Group value={mode} onChange={(value) => setMode(value)}>
          <Radio.Button value="push">push</Radio.Button>
          <Radio.Button value="overlay">overlay</Radio.Button>
        </Radio.Group>
      </div>

      <div>
        <Button theme="primary" onClick={handleClick}>
          Open
        </Button>
      </div>

      <Drawer placement={placement} key={placement} attach={'body'}  header="Drawer" visible={visible} onClose={handleClose} mode={mode}>
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
