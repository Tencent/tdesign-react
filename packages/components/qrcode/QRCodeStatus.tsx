import React, { useCallback, useMemo } from 'react';
import { RefreshIcon } from 'tdesign-icons-react';
import CheckCircleFilled from 'tdesign-icons-react/lib/components/check-circle-filled';
import type { TdQRCodeProps, StatusRenderInfo } from './type';
import Loading from '../loading';
import { QRCodeConfig } from '../config-provider/type';

export type QRcodeStatusProps = {
  locale: QRCodeConfig;
  classPrefix: string;
  onRefresh?: TdQRCodeProps['onRefresh'];
  statusRender?: TdQRCodeProps['statusRender'];
  status: StatusRenderInfo['status'];
};

const defaultSpin = <Loading size="32px" />;

export default function QRcodeStatus({ locale, classPrefix, onRefresh, statusRender, status }: QRcodeStatusProps) {
  const defaultExpiredNode = useMemo(
    () => (
      <>
        <p className={`${classPrefix}-expired__text`}>{locale?.expiredText}</p>
        {onRefresh && (
          <p className={`${classPrefix}-expired__button`} onClick={onRefresh}>
            <RefreshIcon size={16} />
            {locale?.refreshText}
          </p>
        )}
      </>
    ),
    [classPrefix, locale?.expiredText, locale?.refreshText, onRefresh],
  );

  const defaultScannedNode = useMemo(
    () => (
      <p className={`${classPrefix}-scanned`}>
        <CheckCircleFilled size={16} className={`${classPrefix}-scanned__icon`} />
        {locale?.scannedText}
      </p>
    ),
    [classPrefix, locale?.scannedText],
  );

  const defaultNodes = useMemo(
    () => ({
      expired: defaultExpiredNode,
      loading: defaultSpin,
      scanned: defaultScannedNode,
    }),
    [defaultExpiredNode, defaultScannedNode],
  );

  const defaultStatusRender: TdQRCodeProps['statusRender'] = useCallback(
    (info) => defaultNodes[info.status],
    [defaultNodes],
  );

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
