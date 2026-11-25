import React, { useState } from 'react';
import { Loading, Switch } from 'tdesign-mobile-react';

export default function FullScreenLoading() {
  const [value, setValue] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (value) => {
    setValue(value);
    setLoading(value);

    if (value)
      setTimeout(() => {
        setValue(false);
        setLoading(false);
      }, 2000);
  };

  return (
    <div className="loading-demo">
      <Loading loading={loading} text="加载中..." fullscreen />
      <div>
        全局加载开关（开启加载1秒后自动归位）：
        <Switch value={value} size="small" onChange={onChange}></Switch>
      </div>
    </div>
  );
}
