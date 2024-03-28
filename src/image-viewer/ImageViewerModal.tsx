import React, { useState, useEffect, useCallback, MouseEvent, KeyboardEvent } from 'react';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import {
  ImageErrorIcon as TdImageErrorIcon,
  ImageIcon as TdImageIcon,
  MirrorIcon as TdMirrorIcon,
  RotationIcon as TdRotationIcon,
} from 'tdesign-icons-react';
import classNames from 'classnames';
import useImagePreviewUrl from '../hooks/useImagePreviewUrl';
import { TooltipLite } from '../tooltip';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TNode } from '../common';
import { downloadFile } from './utils';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModalMini } from './ImageViewerMini';
import useMirror from './hooks/useMirror';
import usePosition from './hooks/usePosition';
import useIndex from './hooks/useIndex';
import useRotate from './hooks/useRotate';
import useScale from './hooks/useScale';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useIconMap from './hooks/useIconMap';
import Image from '../image';

import type { TdImageViewerProps } from './type';
import { ImageViewerProps } from './ImageViewer';

const ImageError = ({ errorText }: { errorText: string }) => {
  const { classPrefix } = useConfig();
  const { ImageErrorIcon } = useGlobalIcon({ ImageErrorIcon: TdImageErrorIcon });

  return (
    <div className={`${classPrefix}-image-viewer__img-error`}>
      {/* 脱离文档流 */}
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
}) => {
  const { classPrefix } = useConfig();

  const [position, onMouseDown] = usePosition({ initPosition: [0, 0] });
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgStyle = {
    transform: `rotateZ(${rotateZ}deg) scale(${scale})`,
    display: !preSrc || loaded ? 'block' : 'none',
  };
  const preImgStyle = { transform: `rotateZ(${rotateZ}deg) scale(${scale})`, display: !loaded ? 'block' : 'none' };
  const boxStyle = { transform: `translate(${position[0]}px, ${position[1]}px) scale(${mirror}, 1)` };

  const { previewUrl: preSrcImagePreviewUrl } = useImagePreviewUrl(preSrc);
  const { previewUrl: mainImagePreviewUrl } = useImagePreviewUrl(src);

  useEffect(() => {
    setError(false);
  }, [preSrcImagePreviewUrl, mainImagePreviewUrl]);

  return (
    <div className={`${classPrefix}-image-viewer__modal-pic`}>
      <div className={`${classPrefix}-image-viewer__modal-box`} style={boxStyle}>
        {error && <ImageError errorText={errorText} />}
        {!error && !!preSrc && (
          <img
            className={`${classPrefix}-image-viewer__modal-image`}
            onMouseDown={(event) => {
              event.stopPropagation();
              onMouseDown(event);
            }}
            src={preSrcImagePreviewUrl}
            style={preImgStyle}
            referrerPolicy={imageReferrerpolicy}
            alt="image"
            draggable="false"
          />
        )}
        {!error && (
          <img
            className={`${classPrefix}-image-viewer__modal-image`}
            onMouseDown={(event) => {
              event.stopPropagation();
              onMouseDown(event);
            }}
            src={mainImagePreviewUrl}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={imgStyle}
            alt="image"
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
  onClick?: (e: MouseEvent<HTMLElement>) => void;
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
  onRotate: (ROTATE_COUNT: number) => void;
  onZoom: () => void;
  onZoomOut: () => void;
  onMirror: () => void;
  onReset: () => void;
  tipText: {
    mirror: string;
    rotate: string;
    originsize: string;
  };
}

export const ImageViewerUtils: React.FC<ImageViewerUtilsProps> = ({
  onZoom,
  scale,
  onZoomOut,
  currentImage,
  onRotate,
  onMirror,
  onReset,
  tipText,
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
        <TooltipLite className={`${classPrefix}-image-viewer__utils--tip`} content={tipText.mirror} showShadow={false}>
          <div className={`${classPrefix}-image-viewer__modal-icon`}>
            <MirrorIcon size="medium" onClick={onMirror} />
          </div>
        </TooltipLite>
        <TooltipLite className={`${classPrefix}-image-viewer__utils--tip`} content={tipText.rotate} showShadow={false}>
          <div className={`${classPrefix}-image-viewer__modal-icon`}>
            <RotationIcon size="medium" onClick={() => onRotate(-ROTATE_COUNT)} />
          </div>
        </TooltipLite>
        <ImageModalIcon size="medium" name="zoom-out" onClick={onZoomOut} />
        <ImageModalIcon
          className={`${classPrefix}-image-viewer__utils-scale`}
          size="medium"
          label={`${scale * 100}%`}
        />
        <ImageModalIcon size="medium" name="zoom-in" onClick={onZoom} />
        <TooltipLite
          className={`${classPrefix}-image-viewer__utils--tip`}
          content={tipText.originsize}
          showShadow={false}
        >
          <div className={`${classPrefix}-image-viewer__modal-icon`}>
            <ImageIcon
              size="medium"
              name="image"
              onClick={() => {
                onReset();
              }}
            />
          </div>
        </TooltipLite>
        {currentImage.download && (
          <ImageModalIcon
            size="medium"
            name="download"
            onClick={() => {
              downloadFile(currentImage.mainImage);
            }}
          />
        )}
      </div>
      {/* <IconFont size="3em" name="page-last" onClick={() => onRotate(ROTATE_COUNT)} /> */}
    </div>
  );
};

type ImageViewerHeaderProps = {
  onImgClick: (index: number, ctx: { trigger: 'current' }) => void;
  images: ImageInfo[];
  currentIndex: number;
  imageRreferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
};

function OneImagePreview({
  image,
  classPrefix,
  imageRreferrerpolicy,
}: {
  image: ImageInfo;
  classPrefix: string;
  imageRreferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
}) {
  const { previewUrl } = useImagePreviewUrl(image.thumbnail || image.mainImage);
  return (
    <Image
      alt=""
      error=""
      src={previewUrl}
      className={`${classPrefix}-image-viewer__header-img`}
      referrerpolicy={imageRreferrerpolicy}
    />
  );
}

const ImageViewerHeader = (props: ImageViewerHeaderProps) => {
  const { classPrefix } = useConfig();
  const { images, currentIndex, onImgClick, imageRreferrerpolicy } = props;

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
              <OneImagePreview image={image} classPrefix={classPrefix} imageRreferrerpolicy={imageRreferrerpolicy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ImageModalProps {
  title?: TNode;
  visible: boolean;
  closeOnOverlay: boolean;
  showOverlay: boolean;
  index: number;
  defaultIndex?: number;
  images: ImageInfo[];
  onClose: (context: { trigger: 'close-btn' | 'overlay' | 'esc'; e: MouseEvent<HTMLElement> | KeyboardEvent }) => void;
  onOpen: () => void;
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  zIndex: number;
  isMini: boolean;
  draggable: boolean;
  closeBtn: boolean | TNode;
  closeOnEscKeydown?: boolean;
  onIndexChange?: (index: number, context: { trigger: 'prev' | 'next' }) => void;
  imageReferrerpolicy?: ImageViewerProps['imageReferrerpolicy'];
}

// 弹窗基础组件
export const ImageModal: React.FC<ImageModalProps> = (props) => {
  const {
    closeOnOverlay,
    showOverlay = true,
    zIndex,
    images,
    isMini,
    imageScale,
    viewerScale,
    closeBtn,
    draggable,
    onOpen,
    onClose,
    visible,
    title,
    closeOnEscKeydown,
    imageReferrerpolicy,
    ...resProps
  } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('imageViewer');

  if (resProps.index === undefined) delete resProps.index;
  const { index, next, prev, setIndex } = useIndex(resProps, images);
  const { rotateZ, onResetRotate, onRotate } = useRotate();
  const { scale, onZoom, onZoomOut, onResetScale } = useScale(imageScale);
  const { mirror, onResetMirror, onMirror } = useMirror();

  const onReset = useCallback(() => {
    onResetScale();
    onResetRotate();
    onResetMirror();
  }, [onResetMirror, onResetScale, onResetRotate]);

  const onWheel = useCallback(
    (e) => {
      e.preventDefault();
      e.deltaY < 0 ? onZoom() : onZoomOut();
    },
    [onZoom, onZoomOut],
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener('wheel', onWheel, { passive: false });
    } else {
      document.removeEventListener('wheel', onWheel);
    }
    return () => {
      document.removeEventListener('wheel', onWheel);
    };
  }, [visible, onWheel]);

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
    originsize: t(locale.originalSizeTipText),
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
        prev={prev}
        next={next}
        mirror={mirror}
        scale={scale}
        title={title}
        onMirror={onMirror}
        onZoom={onZoom}
        onClose={onClose}
        onZoomOut={onZoomOut}
        onReset={onReset}
        onRotate={onRotate}
        errorText={errorText}
        tipText={tipText}
        imageReferrerpolicy={imageReferrerpolicy}
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
        onClick={(e: MouseEvent<HTMLElement>) => onClose && onClose({ trigger: 'close-btn', e })}
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
          onClick={(e: MouseEvent<HTMLElement>) => closeOnOverlay && onClose?.({ trigger: 'overlay', e })}
        />
      )}
      {images.length > 1 && (
        <>
          <ImageViewerHeader images={images} currentIndex={index} onImgClick={setIndex} />
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
        onZoom={onZoom}
        onZoomOut={onZoomOut}
        scale={scale}
        currentImage={currentImage}
        onRotate={onRotate}
        onMirror={onMirror}
        onReset={onReset}
        tipText={tipText}
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
      />
    </div>
  );
};
