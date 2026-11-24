import React, { useState } from 'react';
import { QRCode, QrCodeProps, Slider, SliderProps } from 'tdesign-mobile-react';

const value = 'https://tdesign.gtimg.com/site/tdesign-logo.png';

export default function QRCodeExample() {
  const marks = {
    0: '7%',
    1: '15%',
    2: '25%',
    3: '30%',
  };
  const levelList: QrCodeProps['level'][] = ['L', 'M', 'Q', 'H'];
  const [level, setLevel] = useState<SliderProps['value']>(1);
  const handleTabs = (value: SliderProps['value']) => {
    setLevel(value);
  };

  return (
    <>
      <Slider min={0} max={3} value={level} marks={marks} onChange={handleTabs} />

      <div className="qrcode-content">
        <QRCode level={levelList[level as number]} value={value} />
      </div>
    </>
  );
}
