import React from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import CheckCircleFilled from 'tdesign-icons-react/lib/components/check-circle-filled';
import CloseCircleFilled from 'tdesign-icons-react/lib/components/close-circle-filled';
import type { QrCodeProps } from 'tdesign-react';
import { QRCode, Space, Loading } from 'tdesign-react';

const value = 'https://tdesign.tencent.com/';

const customStatusRender: QrCodeProps['statusRender'] = (info) => {
  switch (info.status) {
    case 'expired':
      return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
            <CloseCircleFilled style={{ color: 'red' }} size={16} />
            <span>二维码过期</span>
          </p>
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              columnGap: '8px',
              color: '#0052d9',
              cursor: 'pointer',
              lineHeight: '32px',
            }}
          >
            <RefreshIcon size={16} />
            <span>点击刷新</span>
          </p>
        </div>
      );
    case 'loading':
      return (
        <Space direction="vertical">
          <Loading size="32px" />
          <p>加载中...</p>
        </Space>
      );
    case 'scanned':
      return (
        <div style={{ display: 'flex', alignItems: 'center', columnGap: '8px' }}>
          <CheckCircleFilled style={{ color: '#2ba471' }} size={16} />
          <span>已扫描</span>
        </div>
      );
    default:
      return null;
  }
};

export default function QRCodeExample() {
  return (
    <Space>
      <QRCode value={value} status="loading" statusRender={customStatusRender} bgColor="#fff" />
      <QRCode
        value={value}
        status="expired"
        bgColor="#fff"
        onRefresh={() => console.log('refresh')}
        statusRender={customStatusRender}
      />
      <QRCode value={value} status="scanned" statusRender={customStatusRender} />
    </Space>
  );
}
