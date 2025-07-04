import React, { useMemo } from 'react';
import classNames from 'classnames';
import type { ImageSettings } from '@tdesign/common-js/qrcode/types';
import { QRCodeCanvas } from './QRCodeCanvas';
import { QRCodeSVG } from './QRCodeSVG';
import { TdQRCodeProps } from './type';
import useDefaultProps from '../hooks/useDefaultProps';
import { qRCodeDefaultProps } from './defaultProps';
import useConfig from '../hooks/useConfig';
import { StyledProps } from '../common';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import QRcodeStatus from './QRCodeStatus';
import useThemeColor from '../hooks/useThemeColor';

export interface QrCodeProps extends TdQRCodeProps, StyledProps {}

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
  } = useDefaultProps<QrCodeProps>(props, qRCodeDefaultProps);
  const { classPrefix } = useConfig();
  const [locale] = useLocaleReceiver('qrcode');

  const { color: themeColor, bgColor: themeBgColor } = useThemeColor();

  // 获取最终的背景色值。
  const finalBgColor = useMemo(() => bgColor || themeBgColor || 'transparent', [bgColor, themeBgColor]);

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
    bgColor: finalBgColor,
    fgColor: color || themeColor,
    imageSettings: icon ? imageSettings : undefined,
    ...rest,
  };

  const cls = classNames(
    `${classPrefix}-qrcode`,
    {
      [`${classPrefix}-borderless`]: borderless,
      [`${classPrefix}-qrcode-svg`]: type === 'svg',
    },
    className,
  );

  const mergedStyle: React.CSSProperties = {
    backgroundColor: finalBgColor,
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
