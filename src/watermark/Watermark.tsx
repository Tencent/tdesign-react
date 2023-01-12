/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef } from 'react';
import { StyledProps } from '../common';
import generateBase64Url from '../_common/js/watermark/generateBase64Url';
import randomMovingStyle from '../_common/js/watermark/randomMovingStyle';
import injectStyle from '../_common/js/utils/injectStyle';
import useConfig from '../hooks/useConfig';
import useMutationObserver from '../_util/useMutationObserver';
import { TdWatermarkProps } from './type';
import { watermarkDefaultProps as defaultProps } from './defaultProps';

export interface WatermarkProps extends TdWatermarkProps, StyledProps {}

const Watermark: React.FC<WatermarkProps> = ({
  alpha = defaultProps.alpha,
  x = 200,
  y = 210,
  width = 120,
  height = 60,
  rotate: tempRotate = defaultProps.rotate,
  zIndex = 10,
  lineSpace = defaultProps.lineSpace,
  isRepeat = defaultProps.isRepeat,
  removable = defaultProps.removable,
  movable = defaultProps.movable,
  moveInterval = defaultProps.moveInterval,
  offset = [],
  content,
  children,
  watermarkContent,
  className,
  style = {},
}) => {
  const { classPrefix } = useConfig();

  let gapX = x;
  let gapY = y;
  let rotate = tempRotate;
  if (movable) {
    gapX = 0;
    gapY = 0;
    rotate = 0;
  }
  const clsName = `${classPrefix}-watermark`;
  const [base64Url, setBase64Url] = useState('');
  const watermarkRef = useRef<HTMLDivElement>();
  const offsetLeft = offset[0] || gapX / 2;
  const offsetTop = offset[1] || gapY / 2;

  useEffect(() => {
    generateBase64Url(
      {
        width,
        height,
        rotate,
        lineSpace,
        alpha,
        gapX,
        gapY,
        watermarkContent,
        offsetLeft,
        offsetTop,
      },
      (url) => {
        setBase64Url(url);
      },
    );
  }, [width, height, rotate, zIndex, lineSpace, alpha, offsetLeft, offsetTop, gapX, gapY, watermarkContent]);

  useMutationObserver(watermarkRef.current, (mutations) => {
    if (removable) return;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removeNodes = mutation.removedNodes;
        removeNodes.forEach((node) => {
          watermarkRef.current.appendChild(node);
        });
      }
    });
  });

  const parent = useRef<HTMLElement>();
  useEffect(() => {
    parent.current = watermarkRef.current.parentElement;
    const keyframesStyle = randomMovingStyle();
    injectStyle(keyframesStyle);
  }, []);

  useMutationObserver(document.body, (mutations) => {
    if (removable) return;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const removeNodes = mutation.removedNodes;
        removeNodes.forEach((node) => {
          const element = node as HTMLElement;
          if (element === watermarkRef.current) {
            parent.current.appendChild(element);
          }
        });
      }
    });
  });

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }} className={clsName} ref={watermarkRef}>
      {children || content}
      <div
        className={className}
        style={{
          zIndex,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundSize: `${gapX + width}px`,
          pointerEvents: 'none',
          backgroundRepeat: movable ? 'no-repeat' : isRepeat ? 'repeat' : 'no-repeat',
          backgroundImage: `url('${base64Url}')`,
          animation: movable ? `watermark infinite ${(moveInterval * 4) / 60}s` : 'none',
          ...style,
        }}
      />
    </div>
  );
};

export default Watermark;
