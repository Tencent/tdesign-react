import React from 'react';
import classNames from 'classnames';
import type { ImageSettings } from '@tdesign/common-js/qr-code/types';
import { QRCodeCanvas } from './QRCodeCanvas';
import { QRCodeSVG } from './QRCodeSVG';
import { TdQrCodeProps } from './type';
import useDefaultProps from '../hooks/useDefaultProps';
import { qrCodeDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import QRcodeStatus from './QRCodeStatus';

export interface QrCodeProps extends TdQrCodeProps, StyledProps {}

const QRCode: React.FC<QrCodeProps> = (props) => {
  const {
    className,
    value,
    borderless,
    iconSize,
    color,
    bgColor,
    style,
    icon,
    size,
    type,
    status,
    onRefresh,
    statusRender,
    ...rest
  } = useDefaultProps<QrCodeProps>(props, qrCodeDefaultProps);
  const { classPrefix } = useConfig();
  const [locale] = useLocaleReceiver('qrCode');
  if (!value) {
    return null;
  }

  const imageSettings: ImageSettings = {
    src: icon as string,
    x: undefined,
    y: undefined,
    height: typeof iconSize === 'number' ? iconSize : iconSize?.height ?? 40,
    width: typeof iconSize === 'number' ? iconSize : iconSize?.width ?? 40,
    excavate: true,
    crossOrigin: 'anonymous',
  };

  const qrCodeProps = {
    value,
    size,
    bgColor,
    fgColor: color,
    imageSettings: icon ? imageSettings : undefined,
    ...rest,
  };

  const cls = classNames(
    `${classPrefix}-qr-code`,
    {
      [`${classPrefix}-borderless`]: !borderless,
    },
    className,
  );

  const mergedStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    ...style,
    width: style?.width ?? size,
    height: style?.height ?? size,
  };

  return (
    <div {...rest} className={cls} style={mergedStyle}>
      {status !== 'active' && (
        <div className={`${classPrefix}-mask`}>
          <QRcodeStatus
            classPrefix={classPrefix}
            locale={locale}
            status={status}
            onRefresh={onRefresh}
            statusRender={statusRender}
          />
        </div>
      )}
      {type === 'canvas' ? <QRCodeCanvas {...qrCodeProps} size={size} /> : <QRCodeSVG {...qrCodeProps} size={size} />}
    </div>
  );
};

QRCode.displayName = 'QRCode';

export default QRCode;
