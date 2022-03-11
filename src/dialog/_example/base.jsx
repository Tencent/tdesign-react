import React, { useState } from 'react';
import { Dialog, Button, Radio } from 'tdesign-react';

export default function BasicUsage() {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div>
      <Button theme="primary" onClick={handleClick}>
        Open Modal
      </Button>
      <Dialog header="Basic Modal" visible={visible} onClose={handleClose}>
        <p>This is a dialog</p>
        <Radio.Group variant="default-filled" defaultValue="gz">
          <Radio.Button value="bj">选项一</Radio.Button>
          <Radio.Button value="gz">选项二</Radio.Button>
          <Radio.Button value="sz">选项三</Radio.Button>
          <Radio.Button value="fj">选项四</Radio.Button>
          <Radio.Button value="cd">选项五</Radio.Button>
        </Radio.Group>
      </Dialog>
    </div>
  );
}
