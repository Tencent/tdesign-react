import React, { useState } from 'react';
import { Drawer, Button, Input, Form } from 'tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Button theme="primary" onClick={handleClick}>
        打开抽屉
      </Button>
      <Drawer header="抽屉标题" visible={visible} onClose={handleClose}>
        <Form labelWidth={60}>
          <Form.FormItem label="Label A">
            <Input />
          </Form.FormItem>
          <Form.FormItem label="Label B">
            <Input />
          </Form.FormItem>
        </Form>
      </Drawer>
    </>
  );
}
