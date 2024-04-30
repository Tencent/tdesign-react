import React, { useState } from 'react';
import { Drawer, Radio, Button, Space } from 'tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('push');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <Space>
      <div>
        <span>抽屉弹出模式：</span>
        <Radio.Group value={mode} onChange={(value) => setMode(value)}>
          <Radio.Button value="push">push</Radio.Button>
          <Radio.Button value="overlay">overlay</Radio.Button>
        </Radio.Group>
      </div>

      <div>
        <Button theme="primary" onClick={handleClick}>
          打开抽屉
        </Button>
      </div>

      <Drawer placement="right" attach={'body'} header="抽屉标题" visible={visible} onClose={handleClose} mode={mode}>
        <p>抽屉的内容</p>
      </Drawer>
    </Space>
  );
}
