import React, { useState } from 'react';
import { Drawer, Radio, Button } from 'tdesign-react';

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
    <div className="tdesign-demo-block-column">
      <Radio.Group value={placement} onChange={(value) => setPlacement(value)}>
        <Radio.Button value="left">left</Radio.Button>
        <Radio.Button value="right">right</Radio.Button>
        <Radio.Button value="top">top</Radio.Button>
        <Radio.Button value="bottom">bottom</Radio.Button>
      </Radio.Group>

      <Radio.Group value={size} onChange={(value) => setSzie(value)}>
        <Radio.Button value="small">small(300px)</Radio.Button>
        <Radio.Button value="medium">medium(500px)</Radio.Button>
        <Radio.Button value="large">large(760px)</Radio.Button>
        <Radio.Button value={200}>200</Radio.Button>
        <Radio.Button value="400px">400px</Radio.Button>
        <Radio.Button value="50%">50%</Radio.Button>
      </Radio.Group>
      <div>
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
