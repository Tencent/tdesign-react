import React from 'react';
import { Button, Popup, QRCode } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <Popup
      overlayInnerStyle={{ padding: '12px' }}
      content={<QRCode value={'https://tdesign.tencent.com/'} size={136} borderless={true} />}
    >
      <Button>Hover me</Button>
    </Popup>
  );
}
