import React, { useState } from 'react';
import { QRCode, QrCodeProps, Radio, Space } from 'tdesign-react';

export default function QRCodeExample() {
  const [level, setLevel] = useState<QrCodeProps['level']>('L');
  const onChange = (value: QrCodeProps['level']) => {
    setLevel(value);
  };

  return (
    <Space direction="vertical">
      <Radio.Group value={level} variant="default-filled" onChange={onChange}>
        <Radio.Button value="L">L</Radio.Button>
        <Radio.Button value="M">M</Radio.Button>
        <Radio.Button value="Q">Q</Radio.Button>
        <Radio.Button value="H">H</Radio.Button>
      </Radio.Group>

      <QRCode
        bgColor="#fff"
        style={{ marginBottom: 16 }}
        level={level}
        value={'https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg'}
      />
    </Space>
  );
}
