import React from 'react';
import { Popup, QRCode } from 'tdesign-react';

export default function QRCodeExample() {
  return <Popup content={<QRCode value={'https://tdesign.tencent.com/'} borderless={false} />}></Popup>;
}
