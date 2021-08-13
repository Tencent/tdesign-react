import React, { useState } from 'react';
import { Switch, Loading } from '@tencent/tdesign-react';

export default function LoadingFullscreen() {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (value) => {
    setChecked(value);
    setLoading(value);

    if (value)
      setTimeout(() => {
        setChecked(false);
        setLoading(false);
      }, 2000);
  };
  return (
    <div>
      <Loading loading={loading} fullscreen preventScrollThrough={true}></Loading>
      Loading state:
      <Switch value={checked} onChange={onChange} />
    </div>
  );
}
