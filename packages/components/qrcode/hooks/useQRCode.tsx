import { QrCode, QrSegment } from '@tdesign/common-js/qrcode/qrcodegen';
import type { ErrorCorrectionLevel, ImageSettings } from '@tdesign/common-js/qrcode/types';
import { ERROR_LEVEL_MAP, getImageSettings, getMarginSize } from '@tdesign/common-js/qrcode/utils';
import React from 'react';

export type QRProps = {
  /**
   * The value to encode into the QR Code. An array of strings can be passed in
   * to represent multiple segments to further optimize the QR Code.
   */
  value: string;
  /**
   * The size, in pixels, to render the QR Code.
   * @defaultValue 128
   */
  size?: number;
  /**
   * The Error Correction Level to use.
   * @see https://www.qrcode.com/en/about/error_correction.html
   * @defaultValue L
   */
  level?: ErrorCorrectionLevel;
  /**
   * The background color used to render the QR Code.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   * @defaultValue #FFFFFF
   */
  bgColor?: string;
  /**
   * The foregtound color used to render the QR Code.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
   * @defaultValue #000000
   */
  fgColor?: string;
  /**
   * The style to apply to the QR Code.
   */
  style?: React.CSSProperties;
  /**
   * Whether or not a margin of 4 modules should be rendered as a part of the
   * QR Code.
   * @deprecated Use `marginSize` instead.
   * @defaultValue false
   */
  includeMargin?: boolean;
  /**
   * The number of _modules_ to use for margin. The QR Code specification
   * requires `4`, however you can specify any number. Values will be turned to
   * integers with `Math.floor`. Overrides `includeMargin` when both are specified.
   * @defaultValue 0
   */
  marginSize?: number;
  /**
   * The settings for the embedded image.
   */
  imageSettings?: ImageSettings;
  /**
   * The title to assign to the QR Code. Used for accessibility reasons.
   */
  title?: string;
  /**
   * The minimum version used when encoding the QR Code. Valid values are 1-40
   * with higher values resulting in more complex QR Codes. The optimal
   * (lowest) version is determined for the `value` provided, using `minVersion`
   * as the lower bound.
   * @defaultValue 1
   */
  minVersion?: number;
};

export type QRPropsCanvas = QRProps & React.CanvasHTMLAttributes<HTMLCanvasElement>;

export type QRPropsSVG = QRProps & React.SVGAttributes<SVGSVGElement>;

interface Options {
  value: string;
  level: ErrorCorrectionLevel;
  minVersion: number;
  includeMargin: boolean;
  marginSize?: number;
  imageSettings?: ImageSettings;
  size: number;
}

export const useQRCode = (opt: Options) => {
  const { value, level, minVersion, includeMargin, marginSize, imageSettings, size } = opt;

  const memoizedQrcode = React.useMemo(() => {
    const segments = QrSegment.makeSegments(value);
    return QrCode.encodeSegments(segments, ERROR_LEVEL_MAP[level], minVersion);
  }, [value, level, minVersion]);

  return React.useMemo(() => {
    const cs = memoizedQrcode.getModules();
    const mg = getMarginSize(includeMargin, marginSize);
    const ncs = cs.length + mg * 2;
    const cis = getImageSettings(cs, size, mg, imageSettings);
    return {
      cells: cs,
      margin: mg,
      numCells: ncs,
      calculatedImageSettings: cis,
      qrcode: memoizedQrcode,
    };
  }, [memoizedQrcode, size, imageSettings, includeMargin, marginSize]);
};
