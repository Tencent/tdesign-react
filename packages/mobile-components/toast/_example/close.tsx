import React from 'react';
import { Toast, Button } from 'tdesign-mobile-react';

export default function () {
  const showToast = () => {
    Toast({
      message: '轻提示文字内容',
      onClose: () => {
        console.log('onClose');
      },
      onDestroy: () => {
        console.log('onDestroy');
      },
    });
  };

  const hideToast = () => {
    Toast.clear();
  };

  return (
    <div className="toast-demo">
      <Button block theme="primary" variant="outline" size="large" onClick={showToast}>
        显示提示
      </Button>

      <Button block theme="primary" variant="outline" size="large" onClick={hideToast}>
        关闭提示
      </Button>
    </div>
  );
}
