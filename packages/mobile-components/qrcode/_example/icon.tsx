import React from 'react';
import { QRCode } from 'tdesign-mobile-react';

const value = 'https://tdesign.tencent.com/';
const icon = 'https://tdesign.gtimg.com/site/tdesign-logo.png';

export default function QRCodeExample() {
  return (
    <>
      <QRCode value={value} icon={icon} />
    </>
  );
}
