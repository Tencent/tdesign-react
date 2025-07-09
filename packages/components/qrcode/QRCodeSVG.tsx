import React from 'react';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FRONT_COLOR,
  DEFAULT_NEED_MARGIN,
  DEFAULT_LEVEL,
  DEFAULT_MINVERSION,
  DEFAULT_SIZE,
  excavateModules,
  generatePath,
} from '@tdesign/common-js/qrcode/utils';
import { useQRCode, QRPropsSVG } from './hooks/useQRCode';

const QRCodeSVG = React.forwardRef<SVGSVGElement, QRPropsSVG>((props, ref) => {
  const {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BACKGROUND_COLOR,
    fgColor = DEFAULT_FRONT_COLOR,
    includeMargin = DEFAULT_NEED_MARGIN,
    minVersion = DEFAULT_MINVERSION,
    title,
    marginSize,
    imageSettings,
    ...otherProps
  } = props;

  const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
    value,
    level,
    minVersion,
    includeMargin,
    marginSize,
    imageSettings,
    size,
  });

  let cellsToDraw = cells;
  let image = null;
  if (imageSettings != null && calculatedImageSettings != null) {
    if (calculatedImageSettings.excavation != null) {
      cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
    }

    image = (
      <image
        href={imageSettings.src}
        height={calculatedImageSettings.h}
        width={calculatedImageSettings.w}
        x={calculatedImageSettings.x + margin}
        y={calculatedImageSettings.y + margin}
        preserveAspectRatio="none"
        opacity={calculatedImageSettings.opacity}
        // when crossOrigin is not set, the image will be tainted
        // and the canvas cannot be exported to an image
        // eslint-disable-next-line react/no-unknown-property
        crossOrigin={calculatedImageSettings.crossOrigin}
      />
    );
  }

  const fgPath = generatePath(cellsToDraw, margin);

  return (
    <svg height={size} width={size} viewBox={`0 0 ${numCells} ${numCells}`} ref={ref} role="img" {...otherProps}>
      {!!title && <title>{title}</title>}
      <path fill={bgColor} d={`M0,0 h${numCells}v${numCells}H0z`} shapeRendering="crispEdges" />
      <path fill={fgColor} d={fgPath} shapeRendering="crispEdges" />
      {image}
    </svg>
  );
});

QRCodeSVG.displayName = 'QRCodeSVG';

export { QRCodeSVG };
