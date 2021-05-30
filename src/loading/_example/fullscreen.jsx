import React, { useState } from 'react';
import { Switch, Loading } from '@tencent/tdesign-react';

export default function LoadingFullscreen() {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (value) => {
    console.log('value', value);
    setChecked(value);
    setLoading(value);
  };
  return (
    <div style={{ position: 'relative' }}>
      <Loading loading={loading} fullscreen={true} preventScrollThrough={true}></Loading>
      Loading state:
      <Switch value={checked} onChange={onChange} />
    </div>
  );
}
