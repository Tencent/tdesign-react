import React from 'react';
import { QRCode } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <QRCode
      icon="https://tdesign.gtimg.com/site/tdesign-logo.png"
      iconSize={30}
      value={'https://tdesign.tencent.com/'}
    />
  );
}
