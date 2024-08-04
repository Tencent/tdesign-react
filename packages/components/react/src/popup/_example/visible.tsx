import React, { useState } from 'react';
import { Button, Popup } from 'tdesign-react';

export default function Controlled() {
  const [visible] = useState(true);

  return (
    <Popup content="这是popup内容" trigger="context-menu" placement="right" visible={visible}>
      <Button>一直显示</Button>
    </Popup>
  );
}
