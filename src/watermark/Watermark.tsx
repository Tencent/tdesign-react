/* eslint-disable no-nested-ternary */
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { StyledProps } from '../common';
import generateBase64Url from '../_common/js/watermark/generateBase64Url';
import randomMovingStyle from '../_common/js/watermark/randomMovingStyle';
import injectStyle from '../_common/js/utils/injectStyle';
import useConfig from '../hooks/useConfig';
import useMutationObserver from '../_util/useMutationObserver';
import { TdWatermarkProps } from './type';
import { watermarkDefaultProps as defaultProps } from './defaultProps';
import { getStyleStr } from './utils';

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
  const styleStr = useRef('');
  const maskclassName = useRef(className);
  const watermarkRef = useRef<HTMLDivElement>();
  const watermarkImgRef = useRef<HTMLDivElement>();
  const stopObservation = useRef(false);
  const offsetLeft = offset[0] || gapX / 2;
  const offsetTop = offset[1] || gapY / 2;

  // 水印节点 - 背景base64
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

  // 水印节点 - styleStr
  useEffect(() => {
    styleStr.current = getStyleStr({
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
    });
  }, [zIndex, gapX, width, movable, isRepeat, base64Url, moveInterval, style]);

  // 水印节点 - className
  useEffect(() => {
    maskclassName.current = className;
  }, [className]);

  // 水印节点 - 渲染
  const renderWatermark = useCallback(() => {
    // 停止监听
    stopObservation.current = true;
    // 删除之前
    watermarkImgRef.current?.remove?.();
    watermarkImgRef.current = undefined;
    // 创建新的
    watermarkImgRef.current = document.createElement('div');
    watermarkImgRef.current.setAttribute('style', styleStr.current);
    if (maskclassName.current) {
      watermarkImgRef.current.setAttribute('class', maskclassName.current);
    }
    watermarkRef.current?.append(watermarkImgRef.current);
    // 继续监听
    setTimeout(() => {
      stopObservation.current = false;
    });
  }, []);

  // 水印节点 - 初始化渲染
  useEffect(() => {
    renderWatermark();
  }, [renderWatermark, zIndex, gapX, width, movable, isRepeat, base64Url, moveInterval, style, className]);

  // 水印节点 - 变化时重新渲染
  useMutationObserver(watermarkRef.current, (mutations) => {
    if (stopObservation.current) return;
    if (removable) return;
    mutations.forEach((mutation) => {
      // 水印节点被删除
      if (mutation.type === 'childList') {
        const removeNodes = mutation.removedNodes;
        removeNodes.forEach((node) => {
          const element = node as HTMLElement;
          if (element === watermarkImgRef.current) {
            renderWatermark();
          }
        });
      }
      // 水印节点其他变化
      if (mutation.target === watermarkImgRef.current) {
        renderWatermark();
      }
    });
  });

  // 组件父节点 - 增加keyframes
  const parent = useRef<HTMLElement>();
  useEffect(() => {
    parent.current = watermarkRef.current.parentElement;
    const keyframesStyle = randomMovingStyle();
    injectStyle(keyframesStyle);
  }, []);

  // 水印节点的父节点 - 防删除
  useMutationObserver(typeof document !== 'undefined' ? document.body : null, (mutations) => {
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
    </div>
  );
};

export default Watermark;
