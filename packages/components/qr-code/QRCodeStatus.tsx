import React from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import type { TdQrCodeProps, StatusRenderInfo } from './type';
import Button from '../button';
import Loading from '../loading';

export type QRcodeStatusProps = {
  locale: any; // 国际化，需要处理下类型
  classPrefix: string;
  onRefresh?: TdQrCodeProps['onRefresh'];
  statusRender?: TdQrCodeProps['statusRender'];
  status: StatusRenderInfo['status'];
};

const defaultSpin = <Loading />;

export default function QRcodeStatus({ locale, classPrefix, onRefresh, statusRender, status }: QRcodeStatusProps) {
  const defaultExpiredNode = (
    <>
      {/* {locale?.expired} */}
      <p className={`${classPrefix}-expired`}>已过期</p>
      {onRefresh && (
        <Button icon={<RefreshIcon />} onClick={onRefresh}>
          {/* {locale?.refresh} */}
          刷新
        </Button>
      )}
    </>
  );

  // {locale?.scanned}
  const defaultScannedNode = <p className={`${classPrefix}-scanned`}>已扫描</p>;

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
      })}
    </>
  );
}
