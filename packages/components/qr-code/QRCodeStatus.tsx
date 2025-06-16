import React, { useCallback, useMemo } from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import type { TdQrCodeProps, StatusRenderInfo } from './type';
import Loading from '../loading';
import { QRCodeConfig } from '../config-provider/type';

export type QRcodeStatusProps = {
  locale: QRCodeConfig;
  classPrefix: string;
  onRefresh?: TdQrCodeProps['onRefresh'];
  statusRender?: TdQrCodeProps['statusRender'];
  status: StatusRenderInfo['status'];
};

const defaultSpin = <Loading />;

export default function QRcodeStatus({ locale, classPrefix, onRefresh, statusRender, status }: QRcodeStatusProps) {
  const defaultExpiredNode = useMemo(()=>(
    <>
      <p className={`${classPrefix}-expired`}>{locale?.expiredText}</p>
      {onRefresh && (
        <p className={`${classPrefix}-expired__button`} onClick={onRefresh}>
          <RefreshIcon />
          {locale?.refreshText}
        </p>
      )}
    </>
  ), [classPrefix, locale?.expiredText, locale?.refreshText, onRefresh]);

  const defaultScannedNode = useMemo(()=>(
    <p className={`${classPrefix}-scanned`}>{locale?.scannedText}</p>
  ),[classPrefix, locale?.scannedText]);

  const defaultNodes = useMemo(()=>(
    {
      expired: defaultExpiredNode,
      loading: defaultSpin,
      scanned: defaultScannedNode,
    }
  ), [defaultExpiredNode, defaultScannedNode]);

  const defaultStatusRender: TdQrCodeProps['statusRender'] = useCallback((info) => defaultNodes[info.status], [defaultNodes]);

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
