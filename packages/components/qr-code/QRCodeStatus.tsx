import React from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import type { TdQrCodeProps, StatusRenderInfo } from './type';
import Button from '../button';
import Loading from '../loading';

export type QRcodeStatusProps = {
  locale: any; // TODO:国际化，需要处理下类型
  classPrefix: string;
  onRefresh?: TdQrCodeProps['onRefresh'];
  statusRender?: TdQrCodeProps['statusRender'];
  status: StatusRenderInfo['status'];
};

const defaultSpin = <Loading />;

export default function QRcodeStatus({ locale, classPrefix, onRefresh, statusRender, status }: QRcodeStatusProps) {
  const defaultExpiredNode = (
    <>
      <p className={`${classPrefix}-expired`}>{locale?.expired}</p>
      {onRefresh && (
        <Button icon={<RefreshIcon />} onClick={onRefresh}>
          {locale?.refresh}
        </Button>
      )}
    </>
  );

  const defaultScannedNode = <p className={`${classPrefix}-scanned`}>{locale?.scanned}</p>;

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
        locale,
        onRefresh,
      }) || null}
    </>
  );
}
