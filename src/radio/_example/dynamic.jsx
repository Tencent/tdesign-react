import React, { useState, useEffect } from 'react';
import { Dialog, Button, Radio } from 'tdesign-react';

export default function BasicUsage() {
  const [visible, setVisible] = useState(false);
  const [text, settext] = useState('');
  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        settext('动态增加了内容');
      }, 3000);
    }
  }, [visible]);

  return (
    <>
      <Button theme="primary" onClick={handleClick}>
        打开弹窗
      </Button>
      <Dialog header="Basic Modal" visible={visible} onClose={handleClose}>
        <p>This is a radiogroup</p>
        <Radio.Group variant="default-filled" defaultValue="sz">
          <Radio.Button value="bj">选项一</Radio.Button>
          <Radio.Button value="gz">选项二{text}</Radio.Button>
          <Radio.Button value="sz">选项三</Radio.Button>
          <Radio.Button value="fj">选项四</Radio.Button>
          <Radio.Button value="cd">选项五</Radio.Button>
        </Radio.Group>
      </Dialog>
    </>
  );
}
