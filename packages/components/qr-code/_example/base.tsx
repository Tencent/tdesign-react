import React from 'react';
import { Input, QRCode, Space } from 'tdesign-react';

export default function QRCodeExample() {
  const [text, setText] = React.useState('https://tdesign.tencent.com/');
  return (
    <Space direction="vertical" align="center">
      <QRCode value={text || '-'} size={120} />
      <QRCode
        icon="https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg"
        iconSize={30}
        value={text || '-'}
        type="svg"
        size={120}
      />
      <Input placeholder="-" value={text} onChange={(v) => setText(v)} />
    </Space>
  );
}
