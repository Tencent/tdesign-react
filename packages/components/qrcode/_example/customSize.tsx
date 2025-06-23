import React, { useState } from 'react';
import { MinusIcon, AddIcon } from 'tdesign-icons-react';
import { Button, QRCode, Space } from 'tdesign-react';

const MIN_SIZE = 48;
const MAX_SIZE = 300;

export default function QRCodeExample() {
  const [size, setSize] = useState<number>(160);

  const increase = () => {
    setSize((prevSize) => {
      const newSize = prevSize + 10;
      if (newSize >= MAX_SIZE) {
        return MAX_SIZE;
      }
      return newSize;
    });
  };

  const decline = () => {
    setSize((prevSize) => {
      const newSize = prevSize - 10;
      if (newSize <= MIN_SIZE) {
        return MIN_SIZE;
      }
      return newSize;
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={decline} disabled={size <= MIN_SIZE} icon={<MinusIcon />}>
          Smaller
        </Button>
        <Button onClick={increase} disabled={size >= MAX_SIZE} icon={<AddIcon />}>
          Larger
        </Button>
      </Space>
      <QRCode
        bgColor="#fff"
        level="H"
        size={size}
        iconSize={size / 4}
        value="https://tdesign.tencent.com/"
        icon="https://cdc.cdn-go.cn/tdc/latest/images/tdesign.svg"
      />
    </>
  );
}
