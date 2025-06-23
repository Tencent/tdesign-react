import React, { useState } from 'react';
import { QRCode, QrCodeProps, Radio, RadioOption, Space } from 'tdesign-react';

export default function QRCodeExample() {
  const [level, setLevel] = useState<QrCodeProps['level']>('L');
  const onChange = (value: QrCodeProps['level']) => {
    setLevel(value);
  };
  const objOptions: RadioOption[] = [
    { label: 'L', value: 'L' },
    { label: 'M', value: 'M' },
    { label: 'Q', value: 'Q' },
    { label: 'H', value: 'H' },
  ];
  return (
    <Space direction="vertical">
      <Radio.Group value={level} options={objOptions} onChange={onChange} />

      <QRCode bgColor="#fff" style={{ marginBottom: 16 }} level={level} value={'https://tdesign.tencent.com/'} />
    </Space>
  );
}
