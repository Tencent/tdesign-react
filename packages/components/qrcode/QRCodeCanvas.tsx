import React from 'react';
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FRONT_COLOR,
  DEFAULT_NEED_MARGIN,
  DEFAULT_LEVEL,
  DEFAULT_MINVERSION,
  DEFAULT_SIZE,
  isSupportPath2d,
  excavateModules,
  generatePath,
} from '@tdesign/common-js/qrcode/utils';
import { useQRCode, QRPropsCanvas } from './hooks/useQRCode';

const QRCodeCanvas = React.forwardRef<HTMLCanvasElement, QRPropsCanvas>((props, ref) => {
  const {
    value,
    size = DEFAULT_SIZE,
    level = DEFAULT_LEVEL,
    bgColor = DEFAULT_BACKGROUND_COLOR,
    fgColor = DEFAULT_FRONT_COLOR,
    includeMargin = DEFAULT_NEED_MARGIN,
    minVersion = DEFAULT_MINVERSION,
    marginSize,
    style,
    imageSettings,
    ...otherProps
  } = props;

  const imgSrc = imageSettings?.src;
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const setCanvasRef = React.useCallback(
    (node: HTMLCanvasElement) => {
      canvasRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        // eslint-disable-next-line no-param-reassign
        ref.current = node;
      }
    },
    [ref],
  );

  const [, setIsImageLoaded] = React.useState(false);

  const { margin, cells, numCells, calculatedImageSettings } = useQRCode({
    value,
    level,
    minVersion,
    includeMargin,
    marginSize,
    imageSettings,
    size,
  });

  React.useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      let cellsToDraw = cells;
      const image = imageRef.current;
      const haveImageToRender =
        calculatedImageSettings != null &&
        image !== null &&
        image.complete &&
        image.naturalHeight !== 0 &&
        image.naturalWidth !== 0;

      if (haveImageToRender) {
        if (calculatedImageSettings.excavation != null) {
          cellsToDraw = excavateModules(cells, calculatedImageSettings.excavation);
        }
      }

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.height = size * pixelRatio;
      canvas.width = size * pixelRatio;
      const scale = (size / numCells) * pixelRatio;
      ctx.scale(scale, scale);

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, numCells, numCells);

      ctx.fillStyle = fgColor;
      if (isSupportPath2d) {
        ctx.fill(new Path2D(generatePath(cellsToDraw, margin)));
      } else {
        cells.forEach((row, rdx) => {
          row.forEach((cell, cdx) => {
            if (cell) {
              ctx.fillRect(cdx + margin, rdx + margin, 1, 1);
            }
          });
        });
      }

      if (calculatedImageSettings) {
        ctx.globalAlpha = calculatedImageSettings.opacity;
      }

      if (haveImageToRender) {
        ctx.drawImage(
          image,
          calculatedImageSettings.x + margin,
          calculatedImageSettings.y + margin,
          calculatedImageSettings.w,
          calculatedImageSettings.h,
        );
      }
    }
  });

  React.useEffect(() => {
    setIsImageLoaded(false);
  }, [imgSrc]);

  const canvasStyle: React.CSSProperties = {
    height: size,
    width: size,
    ...style,
  };

  let img = null;
  if (imgSrc != null) {
    img = (
      <img
        src={imgSrc}
        key={imgSrc}
        style={{ display: 'none' }}
        onLoad={() => {
          setIsImageLoaded(true);
        }}
        ref={imageRef}
        // when crossOrigin is not set, the image will be tainted
        // and the canvas cannot be exported to an image
        crossOrigin={calculatedImageSettings?.crossOrigin}
      />
    );
  }
  return (
    <>
      <canvas style={canvasStyle} height={size} width={size} ref={setCanvasRef} role="img" {...otherProps} />
      {img}
    </>
  );
});

QRCodeCanvas.displayName = 'QRCodeCanvas';

export { QRCodeCanvas };
