import React, { useState } from 'react';
import { TdTransferProps, Transfer, TransferValue } from 'tdesign-react';

const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i,
    label: `内容${i + 1}`,
    disabled: i % 4 < 1,
  });
}

export default function BaseExample() {
  const [checked, setChecked] = useState<TransferValue[]>([0, 1, 2, 3]);
  const handleTransferCheckedChange: TdTransferProps<{ value: number }>['onCheckedChange'] = (options) => {
    setChecked(options.checked);
  };

  return <Transfer data={list} defaultChecked={checked} onCheckedChange={handleTransferCheckedChange}></Transfer>;
}
