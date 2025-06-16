import React from 'react';
import CheckCircleFilled from 'tdesign-icons-react/lib/components/check-circle-filled';
import type { QrCodeProps } from 'tdesign-react';
import { QRCode, Space, Loading } from 'tdesign-react';

const value = 'https://tdesign.tencent.com/';

const customStatusRender: QrCodeProps['statusRender'] = (info) => {
  switch (info.status) {
    case 'expired':
      return (
        <div>
          二维码过期
          <p style={{ color: '#0052D9', cursor: 'pointer' }}>点击刷新</p>
        </div>
      );
    case 'loading':
      return (
        <Space direction="vertical">
          <Loading />
        </Space>
      );
    case 'scanned':
      return (
        <div>
          <CheckCircleFilled style={{ color: 'green' }} /> 已扫描
        </div>
      );
    default:
      return null;
  }
};

export default function QRCodeExample() {
  return (
    <Space>
      <QRCode value={value} status="loading" statusRender={customStatusRender} />
      <QRCode
        value={value}
        status="expired"
        onRefresh={() => console.log('refresh')}
        statusRender={customStatusRender}
      />
      <QRCode value={value} status="scanned" statusRender={customStatusRender} />
    </Space>
  );
}
