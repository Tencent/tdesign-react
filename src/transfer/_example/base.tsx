import React, { useState } from 'react';
import { Transfer } from 'tdesign-react';

import type { TransferProps } from 'tdesign-react';

const list: TransferProps['data'] = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    disabled: i % 4 < 1,
  });
}

export default function BaseExample() {
  const [value, setValue] = useState(['2']);

  return <Transfer data={list} value={value} onChange={(v: string[]) => setValue(v)}></Transfer>;
}
