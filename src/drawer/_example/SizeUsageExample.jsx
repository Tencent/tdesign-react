import React, { useState } from 'react';
import { Drawer, Radio, Button } from '@tencent/tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');
  // prettier-ignore
  const [size, setSzie] = useState('small');

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
      <div style={{ marginTop: 16 }}>
        <Radio.Group value={size} onChange={(value) => setSzie(value)}>
          <Radio.Button name="small">small(300px)</Radio.Button>
          <Radio.Button name="middle">middle(500px)</Radio.Button>
          <Radio.Button name="large">large(760px)</Radio.Button>
          <Radio.Button name={200}>200</Radio.Button>
          <Radio.Button name="400px">400px</Radio.Button>
          <Radio.Button name="50%">50%</Radio.Button>
        </Radio.Group>
      </div>
      <div style={{ marginTop: 16 }}>
        <Button theme="primary" onClick={handleClick}>
          Open
        </Button>
      </div>
      <Drawer size={size} placement={placement} key={placement} title="Drawer" visible={visible} onClose={handleClose}>
        <p>This is a drawer</p>
      </Drawer>
    </div>
  );
}
