import React, { useState } from 'react';
import { Drawer, Button, Input, Form } from '@tencent/tdesign-react';

export default function () {
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
        Open
      </Button>
      <Drawer header="标题名称" visible={visible} onClose={handleClose}>
        <Form labelWidth={60}>
          <Form.FormItem label="Label A">
            <Input />
          </Form.FormItem>
          <Form.FormItem label="Label B">
            <Input />
          </Form.FormItem>
        </Form>
      </Drawer>
    </div>
  );
}
