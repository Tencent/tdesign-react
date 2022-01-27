import React, { useState } from 'react';
import { Drawer, Radio, Button } from 'tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [size, setSzie] = useState('small');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div className="tdesign-demo-block-column">
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
          打开抽屉
        </Button>
      </div>
      <Drawer size={size} title="Drawer" placement="right" visible={visible} onClose={handleClose}>
        <p>抽屉的内容</p>
      </Drawer>
    </div>
  );
}
