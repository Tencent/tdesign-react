import React from 'react';
import { Input } from 'tdesign-react';

export default function InputAutoWidth() {
  return (
    <div style={{ maxWidth: '500px' }}>
      <Input autoWidth defaultValue="宽度自适应" />
    </div>
  );
}
