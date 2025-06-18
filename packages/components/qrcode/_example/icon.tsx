import React from 'react';
import { QRCode } from 'tdesign-react';

export default function QRCodeExample() {
  return (
    <QRCode
      icon="https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg"
      iconSize={30}
      value={'https://tdesign.tencent.com/'}
    />
  );
}
