import React from 'react';
import { QRCode, Loading } from 'tdesign-mobile-react';
import type { StatusRenderInfo } from 'tdesign-mobile-react';
import { CloseCircleFilledIcon, RefreshIcon } from 'tdesign-icons-react';

const value = 'https://tdesign.tencent.com/';

export default function QRCodeExample() {
  const renderStatus = (info: StatusRenderInfo) => {
    if (info.status === 'loading') {
      return (
        <div className="tdesign-demo-qrcode__status-render">
          <Loading size="32px" />
          <p className="tdesign-demo-qrcode__status-render-text">加载中...</p>
        </div>
      );
    }
    if (info.status === 'expired') {
      return (
        <div className="tdesign-demo-qrcode__status-render">
          <p className="tdesign-demo-qrcode__status-render-title">
            <CloseCircleFilledIcon size={16} />
            <span>二维码过期</span>
          </p>
          <p className="tdesign-demo-qrcode__status-render-action" onClick={() => console.log('Click Refresh')}>
            <RefreshIcon size={16} />
            <span>点击刷新</span>
          </p>
        </div>
      );
    }
  };

  return (
    <div className="tdesign-demos-qrcode">
      <QRCode value={value} status="loading" statusRender={renderStatus} />
      <QRCode value={value} status="expired" statusRender={renderStatus} />
      <QRCode value={value} status="scanned" />
    </div>
  );
}
