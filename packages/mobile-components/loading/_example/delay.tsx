import React, { useState } from 'react';
import { Loading, Switch } from 'tdesign-mobile-react';

export default function DelayLoading() {
  const [showLoading, setShowLoading] = useState(false);

  const clickSwitch = (value) => {
    setShowLoading(value);
  };

  return (
    <div className="demo-content demo-content--column">
      <Switch label={['请求发起，延迟显示loading', '请求结束，隐藏loading']} onChange={clickSwitch} />
      <div className="demo-loading">
        <Loading delay={1000} loading={showLoading} text="加载中..." />
      </div>
    </div>
  );
}
