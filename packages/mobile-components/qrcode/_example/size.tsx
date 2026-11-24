import React, { useState } from 'react';
import { QRCode, Button } from 'tdesign-mobile-react';

const MIN_SIZE = 48;
const MAX_SIZE = 300;

const value = 'https://tdesign.tencent.com/';

export default function QRCodeExample() {
  const [size, setSize] = useState<number>(160);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="button-group">
        <Button className="button" variant="text" disabled={size <= MIN_SIZE} onClick={() => setSize(size - 10)}>
          - Smaller
        </Button>

        <div className="line"></div>
        <Button className="button" variant="text" disabled={size >= MAX_SIZE} onClick={() => setSize(size + 10)}>
          + Larger
        </Button>
      </div>

      <div className="container">
        <QRCode size={size} value={value} />
      </div>
    </div>
  );
}
