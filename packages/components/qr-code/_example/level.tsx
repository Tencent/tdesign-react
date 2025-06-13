import React, { useState } from 'react';
import { QRCode, QrCodeProps, Select } from 'tdesign-react';

export default function QRCodeExample() {
  const [level, setLevel] = useState<QrCodeProps['level']>('L');
  const onChange = (value: any) => {
    setLevel(value);
  };
  return (
    <>
      <QRCode style={{ marginBottom: 16 }} level={level} value={'https://tdesign.tencent.com/'} />
      <Select
        value={level}
        style={{ width: '40%' }}
        onChange={onChange}
        options={[
          { label: 'L', value: 'L' },
          { label: 'M', value: 'M' },
          { label: 'Q', value: 'Q' },
          { label: 'H', value: 'H' },
        ]}
      />
    </>
  );
}
