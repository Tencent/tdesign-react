import React, { useState } from 'react';
import { Button, Popup } from '@tencent/tdesign-react';

export default function Controlled() {
  const [visible, setVisible] = useState(false);

  return (
    <Popup
      showArrow
      trigger="manual"
      visible={visible}
      content={<Button onClick={() => setVisible(false)}>隐藏</Button>}
    >
      <Button onClick={() => setVisible(true)}>点击</Button>
    </Popup>
  );
}
