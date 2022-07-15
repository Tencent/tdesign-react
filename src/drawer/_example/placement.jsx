import React, { useState } from 'react';
import { Drawer, Radio, Button, Space } from 'tdesign-react';

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
    <Space>
      <Radio.Group value={placement} onChange={(value) => setPlacement(value)}>
        <Radio.Button value="left">左侧</Radio.Button>
        <Radio.Button value="right">右侧</Radio.Button>
        <Radio.Button value="top">上方</Radio.Button>
        <Radio.Button value="bottom">下方</Radio.Button>
      </Radio.Group>

      <div>
        <Button theme="primary" onClick={handleClick}>
          打开抽屉
        </Button>
      </div>
      <Drawer placement={placement} key={placement} visible={visible} onClose={handleClose}>
        <p>抽屉的内容</p>
      </Drawer>
    </Space>
  );
}
