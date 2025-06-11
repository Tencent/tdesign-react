import React from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import type { TdQrCodeProps, StatusRenderInfo } from './type';
import Button from '../button';
import Loading from '../loading';
import { QrCodeConfig } from '../config-provider/type';

export type QRcodeStatusProps = {
  locale: QrCodeConfig;
  classPrefix: string;
  onRefresh?: TdQrCodeProps['onRefresh'];
  statusRender?: TdQrCodeProps['statusRender'];
  status: StatusRenderInfo['status'];
};

const defaultSpin = <Loading />;

export default function QRcodeStatus({ locale, classPrefix, onRefresh, statusRender, status }: QRcodeStatusProps) {
  const defaultExpiredNode = (
    <>
      <p className={`${classPrefix}-expired`}>{locale?.expiredText}</p>
      {onRefresh && (
        <Button icon={<RefreshIcon />} onClick={onRefresh}>
          {locale?.refreshText}
        </Button>
      )}
    </>
  );

  const defaultScannedNode = <p className={`${classPrefix}-scanned`}>{locale?.scannedText}</p>;

  const defaultNodes = {
    expired: defaultExpiredNode,
    loading: defaultSpin,
    scanned: defaultScannedNode,
  };

  const defaultStatusRender: TdQrCodeProps['statusRender'] = (info) => defaultNodes[info.status];

  const mergedStatusRender = statusRender ?? defaultStatusRender;

  return (
    <>
      {mergedStatusRender({
        status,
        onRefresh,
      }) || null}
    </>
  );
}
