import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isArray, isFunction } from 'lodash-es';
import {
  ImageErrorIcon as TdImageErrorIcon,
  ImageIcon as TdImageIcon,
  MirrorIcon as TdMirrorIcon,
  RotationIcon as TdRotationIcon,
} from 'tdesign-icons-react';

import { downloadImage } from '@tdesign/common-js/image-viewer/utils';
import { largeNumberToFixed } from '@tdesign/common-js/input-number/large-number';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useImagePreviewUrl from '../hooks/useImagePreviewUrl';
import Image from '../image';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TooltipLite } from '../tooltip';
import { ImageModalMini } from './ImageViewerMini';
import useIconMap from './hooks/useIconMap';
import useIndex from './hooks/useIndex';
import useMirror from './hooks/useMirror';
import usePosition from './hooks/usePosition';
import useRotate from './hooks/useRotate';
import useScale from './hooks/useScale';

import type { TNode } from '../common';
import type { ImageViewerProps } from './ImageViewer';
import type { ImageInfo, ImageScale, ImageViewerScale, TdImageViewerProps } from './type';

const ImageError = ({ errorText }: { errorText: string }) => {
  const { classPrefix } = useConfig();
  const { ImageErrorIcon } = useGlobalIcon({ ImageErrorIcon: TdImageErrorIcon });

  return (
    <div className={`${classPrefix}-image-viewer__img-error`}>
      <div className={`${classPrefix}-image-viewer__img-error-content`}>
        <ImageErrorIcon size="4em" />
        <div className={`${classPrefix}-image-viewer__img-error-text`}>{errorText}</div>
      </div>
    </div>
  );
};

interface ImageModalItemProps {
  rotateZ: number;
  scale: number;
  mirror: number;
  src: string | File;
  preSrc?: string | File;
  errorText: string;
  imageReferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
  isSvg: boolean;
}

// 单个弹窗实例
export const ImageModalItem: React.FC<ImageModalItemProps> = ({
  rotateZ,
  scale,
  src,
  preSrc,
  mirror,
  errorText,
  imageReferrerpolicy,
  isSvg,
}) => {
  const { classPrefix } = useConfig();

  const imgRef = useRef<HTMLImageElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgStyle = {
    transform: `rotateZ(${rotateZ}deg) scale(${scale})`,
    display: !preSrc || loaded ? 'block' : 'none',
  };

  const { previewUrl: preSrcImagePreviewUrl } = useImagePreviewUrl(preSrc);
  const { previewUrl: mainImagePreviewUrl } = useImagePreviewUrl(src);

  const displayRef = useMemo(() => {
    if (isSvg) return svgRef;
    return imgRef;
  }, [isSvg]);
  const { position } = usePosition(displayRef);
  const preImgStyle = { transform: `rotateZ(${rotateZ}deg) scale(${scale})`, display: !loaded ? 'block' : 'none' };
  const boxStyle = { transform: `translate(${position[0]}px, ${position[1]}px) scale(${mirror}, 1)` };

  const createSvgShadow = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      setError(true);
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }

    const svgText = await response.text();

    const element = svgRef.current;
    element.innerHTML = '';
    element.classList?.add(`${classPrefix}-image-viewer__modal-image-svg`);
    const shadowRoot = element.attachShadow({ mode: 'closed' });

    const container = document.createElement('div');
    container.style.background = 'transparent';
    container.innerHTML = svgText;
    shadowRoot.appendChild(container);

    const svgElement = container.querySelector('svg');
    if (svgElement) {
      const svgViewBox = svgElement.getAttribute('viewBox');
      if (svgViewBox) {
        const viewBoxValues = svgViewBox
          .split(/[\s,]/)
          .filter((v) => v)
          .map(parseFloat);

        // svg viewbox x(0) and y(1) offset, width(2) and height(3),eg
        const svgViewBoxWidth = viewBoxValues[2];
        const svgViewBoxHeight = viewBoxValues[3];
        container.style.width = `${svgViewBoxWidth}px`;
        container.style.height = `${svgViewBoxHeight}px`;
      } else {
        const bbox = svgElement.getBBox();
        const calculatedViewBox = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
        svgElement.setAttribute('viewBox', calculatedViewBox);

        container.style.width = `${bbox.width}px`;
        container.style.height = `${bbox.height}px`;
      }
    }
    setLoaded(true);
  };

  useEffect(() => {
    setError(false);
  }, [preSrcImagePreviewUrl, mainImagePreviewUrl]);

  useEffect(() => {
    if (isSvg && mainImagePreviewUrl) {
      createSvgShadow(mainImagePreviewUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainImagePreviewUrl]);

  return (
    <div className={`${classPrefix}-image-viewer__modal-pic`}>
      <div className={`${classPrefix}-image-viewer__modal-box`} style={boxStyle}>
        {error && <ImageError errorText={errorText} />}
        {/* 预览图 */}
        {!error && !!preSrc && preSrcImagePreviewUrl && (
          <img
            className={`${classPrefix}-image-viewer__modal-image`}
            src={preSrcImagePreviewUrl}
            style={preImgStyle}
            referrerPolicy={imageReferrerpolicy}
            alt="image"
            draggable="false"
          />
        )}
        {/* 普通主图 */}
        {!error && mainImagePreviewUrl && !isSvg && (
          <img
            ref={imgRef}
            className={`${classPrefix}-image-viewer__modal-image`}
            src={mainImagePreviewUrl}
            style={imgStyle}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            referrerPolicy={imageReferrerpolicy}
            alt="image"
            draggable="false"
          />
        )}
        {/* SVG 主图 */}
        {!error && !!mainImagePreviewUrl && isSvg && (
          <div
            ref={svgRef}
            className={`${classPrefix}-image-viewer__modal-image`}
            style={imgStyle}
            data-alt="svg"
            draggable="false"
          />
        )}
      </div>
    </div>
  );
};

// 旋转角度单位
const ROTATE_COUNT = 90;

interface ImageModalIconProps {
  name?: string;
  size?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  isRange?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const ImageModalIcon = ({ onClick, className, disabled, isRange, name, label, size = '16px' }: ImageModalIconProps) => {
  const { classPrefix } = useConfig();

  const Icons = useIconMap();

  const Icon = Icons[name];
  return (
    <div
      className={classNames(`${classPrefix}-image-viewer__modal-icon`, className, {
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      onClick={onClick}
    >
      {name && <Icon size={size} className={isRange ? 'is-range' : null} />}
      {label && <span className={`${classPrefix}-image-viewer__modal-icon-label`}>{label}</span>}
    </div>
  );
};

interface ImageViewerUtilsProps {
  scale: number;
  currentImage: ImageInfo;
  tipText: {
    mirror: string;
    rotate: string;
    originalSize: string;
  };
  zIndex: number;
  onMirror: () => void;
  onRotate: (ROTATE_COUNT: number) => void;
  onZoom: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onDownload?: TdImageViewerProps['onDownload'];
}

export const ImageViewerUtils: React.FC<ImageViewerUtilsProps> = ({
  scale,
  currentImage,
  tipText,
  zIndex,
  onMirror,
  onRotate,
  onZoom,
  onZoomOut,
  onReset,
  onDownload,
}) => {
  const { classPrefix } = useConfig();
  const { MirrorIcon, RotationIcon, ImageIcon } = useGlobalIcon({
    MirrorIcon: TdMirrorIcon,
    RotationIcon: TdRotationIcon,
    ImageIcon: TdImageIcon,
  });

  return (
    <div className={`${classPrefix}-image-viewer__utils`}>
      <div className={`${classPrefix}-image-viewer__utils-content`}>
        <TooltipLite
          className={`${classPrefix}-image-viewer__utils--tip`}
          content={tipText.mirror}
          showShadow={false}
          zIndex={zIndex}
        >
          <div className={`${classPrefix}-image-viewer__modal-icon`} onClick={onMirror}>
            <MirrorIcon size="medium" />
          </div>
        </TooltipLite>
        <TooltipLite
          className={`${classPrefix}-image-viewer__utils--tip`}
          content={tipText.rotate}
          showShadow={false}
          zIndex={zIndex}
        >
          <div className={`${classPrefix}-image-viewer__modal-icon`} onClick={() => onRotate(-ROTATE_COUNT)}>
            <RotationIcon size="medium" />
          </div>
        </TooltipLite>
        <ImageModalIcon size="medium" name="zoom-out" onClick={onZoomOut} />
        <ImageModalIcon
          className={`${classPrefix}-image-viewer__utils-scale`}
          size="medium"
          label={`${largeNumberToFixed(String(scale * 100))}%`}
        />
        <ImageModalIcon size="medium" name="zoom-in" onClick={onZoom} />
        <TooltipLite
          className={`${classPrefix}-image-viewer__utils--tip`}
          content={tipText.originalSize}
          showShadow={false}
          zIndex={zIndex}
        >
          <div className={`${classPrefix}-image-viewer__modal-icon`} onClick={onReset}>
            <ImageIcon size="medium" name="image" />
          </div>
        </TooltipLite>
        {currentImage.download && (
          <ImageModalIcon
            size="medium"
            name="download"
            onClick={() => {
              if (isFunction(onDownload)) {
                // 自定义图片预览下载
                onDownload(currentImage.mainImage);
                return;
              }
              downloadImage(currentImage.mainImage);
            }}
          />
        )}
      </div>
    </div>
  );
};

type ImageViewerHeaderProps = {
  onImgClick: (index: number, ctx: { trigger: 'current' }) => void;
  images: ImageInfo[];
  currentIndex: number;
  imageReferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
};

function OneImagePreview({
  image,
  classPrefix,
  imageReferrerpolicy,
}: {
  image: ImageInfo;
  classPrefix: string;
  imageReferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
}) {
  const { previewUrl } = useImagePreviewUrl(image.thumbnail || image.mainImage);
  return (
    <Image
      alt=""
      error=""
      src={previewUrl}
      className={`${classPrefix}-image-viewer__header-img`}
      referrerpolicy={imageReferrerpolicy}
    />
  );
}

const ImageViewerHeader = (props: ImageViewerHeaderProps) => {
  const { classPrefix } = useConfig();
  const { images, currentIndex, onImgClick, imageReferrerpolicy } = props;

  const [isExpand, setIsExpand] = useState(true);

  // 宽高比 16:9 按比例偏移
  const transStyle = { transform: `translateX(calc(-${currentIndex} * (40px / 9 * 16 + 4px)))` };

  return (
    <div
      className={classNames(`${classPrefix}-image-viewer__modal-header`, {
        [`${classPrefix}-is-show`]: isExpand,
      })}
    >
      <ImageModalIcon
        name="chevron-down"
        className={`${classPrefix}-image-viewer__header-pre-bt`}
        onClick={() => setIsExpand(!isExpand)}
      />
      <div className={`${classPrefix}-image-viewer__header-prev`}>
        <div className={`${classPrefix}-image-viewer__header-trans`} style={transStyle}>
          {images.map((image, index) => (
            <div
              key={index}
              className={classNames(`${classPrefix}-image-viewer__header-box`, {
                [`${classPrefix}-is-active`]: index === currentIndex,
              })}
              onClick={() => onImgClick(index, { trigger: 'current' })}
            >
              <OneImagePreview image={image} classPrefix={classPrefix} imageReferrerpolicy={imageReferrerpolicy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export interface ImageModalProps {
  title?: TNode;
  visible: boolean;
  closeOnOverlay: boolean;
  showOverlay: boolean;
  index: number;
  defaultIndex?: number;
  images: ImageInfo[];
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  zIndex: number;
  isMini: boolean;
  draggable: boolean;
  closeBtn: boolean | TNode;
  closeOnEscKeydown?: boolean;
  imageReferrerpolicy?: ImageViewerProps['imageReferrerpolicy'];
  onClose: (context: {
    trigger: 'close-btn' | 'overlay' | 'esc';
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent;
  }) => void;
  onOpen: () => void;
  onDownload?: TdImageViewerProps['onDownload'];
  onIndexChange?: (index: number, context: { trigger: 'prev' | 'next' | 'current' }) => void;
}

// 弹窗基础组件
export const ImageModal: React.FC<ImageModalProps> = (props) => {
  const {
    closeOnOverlay,
    showOverlay = true,
    index,
    zIndex,
    images,
    isMini,
    imageScale,
    viewerScale,
    closeBtn,
    draggable,
    visible,
    title,
    closeOnEscKeydown,
    imageReferrerpolicy,
    onOpen,
    onClose,
    onDownload,
    onIndexChange,
  } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('imageViewer');

  const { next, prev } = useIndex(props, images);
  const { rotateZ, onResetRotate, onRotate } = useRotate();
  const { scale, onZoom, onZoomOut, onResetScale } = useScale(imageScale, visible);
  const { mirror, onResetMirror, onMirror } = useMirror();

  const onReset = useCallback(() => {
    onResetScale();
    onResetRotate();
    onResetMirror();
  }, [onResetMirror, onResetScale, onResetRotate]);

  const onKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowRight':
          return next();
        case 'ArrowLeft':
          return prev();
        case 'ArrowUp':
          return onZoom();
        case 'ArrowDown':
          return onZoomOut();
        case 'Escape':
          return closeOnEscKeydown && onClose?.({ trigger: 'esc', e: event });
      }
    },
    [next, onClose, prev, onZoom, onZoomOut, closeOnEscKeydown],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    onReset();
  }, [index, onReset]);

  if (!isArray(images) || images.length < 1) return null;

  const currentImage: ImageInfo = images[index];

  const tipText = {
    mirror: t(locale.mirrorTipText),
    rotate: t(locale.rotateTipText),
    originalSize: t(locale.originalSizeTipText),
  };
  const errorText = t(locale.errorText);

  if (isMini) {
    return (
      <ImageModalMini
        visible={visible}
        draggable={draggable}
        index={index}
        images={images}
        imageScale={imageScale}
        viewerScale={viewerScale}
        rotateZ={rotateZ}
        zIndex={zIndex}
        currentImage={currentImage}
        mirror={mirror}
        scale={scale}
        title={title}
        errorText={errorText}
        tipText={tipText}
        imageReferrerpolicy={imageReferrerpolicy}
        prev={prev}
        next={next}
        onMirror={onMirror}
        onRotate={onRotate}
        onZoom={onZoom}
        onZoomOut={onZoomOut}
        onReset={onReset}
        onClose={onClose}
      />
    );
  }

  // boolean控制显示，tnode直接展示
  let closeNode: TNode = closeBtn;
  if (closeBtn === true) {
    closeNode = (
      <ImageModalIcon
        name="close"
        size="24px"
        className={`${classPrefix}-image-viewer__modal-close-bt `}
        onClick={(e: React.MouseEvent<HTMLElement>) => onClose && onClose({ trigger: 'close-btn', e })}
      />
    );
  } else if (isFunction(closeBtn)) closeNode = closeBtn({ onClose, onOpen });

  return (
    <div
      className={classNames(`${classPrefix}-image-viewer-preview-image`, {
        [`${classPrefix}-is-hide`]: !visible,
      })}
      style={{ zIndex }}
    >
      {!!showOverlay && (
        <div
          className={`${classPrefix}-image-viewer__modal-mask`}
          onClick={(e: React.MouseEvent<HTMLElement>) => closeOnOverlay && onClose?.({ trigger: 'overlay', e })}
        />
      )}
      {images.length > 1 && (
        <>
          <ImageViewerHeader
            images={images}
            currentIndex={index}
            onImgClick={onIndexChange}
            imageReferrerpolicy={imageReferrerpolicy}
          />
          <div className={`${classPrefix}-image-viewer__modal-index`}>
            <span>{title}</span>
            {`${index + 1}/${images.length}`}
          </div>
          <ImageModalIcon
            size="24px"
            name="chevron-left"
            className={`${classPrefix}-image-viewer__modal-prev-bt`}
            onClick={prev}
            disabled={index <= 0}
          />
          <ImageModalIcon
            size="24px"
            name="chevron-right"
            className={`${classPrefix}-image-viewer__modal-next-bt`}
            onClick={next}
            disabled={index >= images.length - 1}
          />
        </>
      )}
      <ImageViewerUtils
        scale={scale}
        tipText={tipText}
        currentImage={currentImage}
        zIndex={zIndex + 1}
        onZoom={onZoom}
        onZoomOut={onZoomOut}
        onDownload={onDownload}
        onRotate={onRotate}
        onMirror={onMirror}
        onReset={onReset}
      />
      {closeNode}
      <ImageModalItem
        scale={scale}
        rotateZ={rotateZ}
        mirror={mirror}
        preSrc={currentImage.thumbnail}
        src={currentImage.mainImage}
        errorText={errorText}
        imageReferrerpolicy={imageReferrerpolicy}
        isSvg={currentImage.isSvg}
      />
    </div>
  );
};
