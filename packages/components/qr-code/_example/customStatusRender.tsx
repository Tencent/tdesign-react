import React from 'react';
import { CheckCircleIcon, CloseCircleIcon, RefreshIcon } from 'tdesign-icons-react';
import type { QrCodeProps } from 'tdesign-react';
import { Button, QRCode, Space, Loading } from 'tdesign-react';

const value = 'https://tdesign.tencent.com/';

const customStatusRender: QrCodeProps['statusRender'] = (info) => {
  switch (info.status) {
    case 'expired':
      return (
        <div>
          <CloseCircleIcon style={{ color: 'red' }} /> {info.locale?.expired}
          <p>
            <Button onClick={info.onRefresh}>
              <RefreshIcon /> {info.locale?.refresh}
            </Button>
          </p>
        </div>
      );
    case 'loading':
      return (
        <Space direction="vertical">
          <Loading />
          <p>Loading...</p>
        </Space>
      );
    case 'scanned':
      return (
        <div>
          <CheckCircleIcon style={{ color: 'green' }} /> {info.locale?.scanned}
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
