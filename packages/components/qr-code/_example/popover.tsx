import React from 'react';
import { Popup, QRCode, Button } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <Popup content={<QRCode value={'https://tdesign.tencent.com/'} borderless={true} />}>
      <Button>Hover me</Button>
    </Popup>
  );
}
