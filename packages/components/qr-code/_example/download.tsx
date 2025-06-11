import React from 'react';
import { Button, QRCode, Select, Space } from 'tdesign-react';
import type { QrCodeProps } from 'tdesign-react';

function doDownload(url: string, fileName: string) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const downloadCanvasQRCode = () => {
  const canvas = document.getElementById('qrcode')?.querySelector<HTMLCanvasElement>('canvas');
  if (canvas) {
    const url = canvas.toDataURL();
    doDownload(url, 'QRCode.png');
  }
};

const downloadSvgQRCode = () => {
  const svg = document.getElementById('qrcode')?.querySelector<SVGElement>('svg');
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  doDownload(url, 'QRCode.svg');
};

export default function QRCodeExample() {
  const [renderType, setRenderType] = React.useState<QrCodeProps['type']>('canvas');
  return (
    <Space direction="vertical">
      <Select
        value={renderType}
        onChange={setRenderType}
        options={[
          { label: 'canvas', value: 'canvas' },
          { label: 'svg', value: 'svg' },
        ]}
      />
      <div id="qrcode">
        <QRCode
          type={renderType}
          value="https://tdesign.tencent.com/"
          bgColor="#fff"
          style={{ marginBottom: 16 }}
          icon="https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg"
        />
        <Button onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}>Download</Button>
      </div>
    </Space>
  );
}
