import React from 'react';
import { Toast, Button } from 'tdesign-mobile-react';
import { PoweroffIcon } from 'tdesign-icons-react';

export default function () {
  const showMssk = () => {
    Toast({
      message: '禁止滑动和点击',
      direction: 'column',
      placement: 'bottom',
      duration: 5000,
      preventScrollThrough: true,
      showOverlay: true,
      icon: <PoweroffIcon />,
    });
  };
  return (
    <div className="toast-demo">
      <Button block theme="primary" variant="outline" size="large" onClick={showMssk}>
        禁止滑动和点击
      </Button>
    </div>
  );
}
