import React, { useState } from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  const [value, setValue] = useState('');
  const suffix = `${value.length}/5`;

  return <Input value={value} onChange={(v) => setValue(v)} maxlength={5} suffix={suffix} />;
}
