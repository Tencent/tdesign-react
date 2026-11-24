import React, { useRef, useState } from 'react';
import { QRCode, Button } from 'tdesign-mobile-react';

const value = 'https://tdesign.tencent.com/';
const icon = 'https://tdesign.gtimg.com/site/tdesign-logo.png';
const typeList: Array<'canvas' | 'svg'> = ['canvas', 'svg'];

function downloadFile(url: string, fileName: string) {
  const a = document.createElement('a');
  a.download = fileName;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function QRCodeExample() {
  const [type, setType] = useState<'canvas' | 'svg'>('canvas');
  const qrcodeRef = useRef<HTMLDivElement>(null);

  const downloadCanvas = () => {
    const canvas = qrcodeRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      downloadFile(url, 'TDesign-QRCode.png');
    }
  };

  const downloadSvg = () => {
    const svg = qrcodeRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      downloadFile(url, 'TDesign-QRCode.svg');
    }
  };

  const handleDownload = () => {
    if (type === 'canvas') {
      downloadCanvas();
    }
    if (type === 'svg') {
      downloadSvg();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="button-group">
        {typeList.map((item) => (
          <Button
            key={item}
            className="button"
            variant="text"
            theme={type === item ? 'primary' : 'default'}
            onClick={() => setType(item)}
          >
            {item}
          </Button>
        ))}
      </div>
      <div ref={qrcodeRef} className="container">
        <QRCode value={value} type={type} icon={icon} />
      </div>
      <div className="button-group">
        <Button className="button" variant="text" theme="primary" onClick={handleDownload}>
          Download
        </Button>
      </div>
    </div>
  );
}
