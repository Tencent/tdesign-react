import React, { useState, useEffect, useCallback, WheelEventHandler } from 'react';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import { IconFont } from 'tdesign-icons-react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TNode } from '../common';
import { downloadFile, useIndex, usePosition, useRotate, useScale } from './useHooks';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelMini } from './ImageViewerMini';

interface ImageModelItemProps {
  rotateZ: number;
  scale: number;
  src: string;
  preSrc?: string;
}

// 单个弹窗实例
export const ImageModelItem = ({ rotateZ, scale, src, preSrc }: ImageModelItemProps) => {
  const [position, onMouseDown] = usePosition({ initPosition: [0, 0] });
  const { classPrefix } = useConfig();

  const [loaded, setLoaded] = useState(false);

  const imgStyle = {
    transform: `rotateZ(${rotateZ}deg) scale(${scale})`,
    display: !preSrc || loaded ? 'block' : 'none',
  };
  const preImgStyle = { transform: `rotateZ(${rotateZ}deg) scale(${scale})`, display: !loaded ? 'block' : 'none' };

  return (
    <div className={`${classPrefix}-image-viewer-modal__pic`}>
      <div
        className={`${classPrefix}-image-viewer-modal__box`}
        style={{ transform: `translate(${position[0]}px, ${position[1]}px)` }}
      >
        {!!preSrc && (
          <img
            className={`${classPrefix}-image-viewer-modal__image`}
            key={preSrc}
            onMouseDown={(event) => {
              event.stopPropagation();
              onMouseDown(event);
            }}
            src={preSrc}
            style={preImgStyle}
            data-testid="img-drag"
            alt="image"
            draggable="false"
          />
        )}
        {
          <img
            className={`${classPrefix}-image-viewer-modal__image`}
            key={src}
            onMouseDown={(event) => {
              event.stopPropagation();
              onMouseDown(event);
            }}
            src={src}
            onLoad={() => setLoaded(true)}
            style={imgStyle}
            data-testid="img-drag"
            alt="image"
            draggable="false"
          />
        }
      </div>
    </div>
  );
};

// 旋转角度单位
const ROTATE_COUNT = 90;

interface ImageModelIconProps {
  name: string;
  size?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  isRange?: boolean;
  onClick?: () => void;
}

const ImageModelIcon = ({ onClick, className, disabled, isRange, name, label, size = '3em' }: ImageModelIconProps) => {
  const { classPrefix } = useConfig();
  return (
    <div
      className={classNames(`${classPrefix}-image-viewer-modal__icon`, className, {
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      onClick={onClick}
    >
      <IconFont size={size} name={name} className={isRange ? 'is-range' : null} />
      {label && <span className={`${classPrefix}-image-viewer-modal__icon-label`}>{label}</span>}
    </div>
  );
};

interface ImageModalProps {
  closeOnOverlay: boolean;
  index: number;
  defaultIndex?: number;
  images: ImageInfo[];
  onClose: () => void;
  onOpen: () => void;
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  zIndex: number;
  isMini: boolean;
  draggable: boolean;
  closeBtn: boolean | TNode;
}

// 弹窗基础组件
export const ImageModal = (props: ImageModalProps) => {
  const {
    closeOnOverlay,
    zIndex,
    images,
    isMini,
    imageScale,
    viewerScale,
    closeBtn,
    onOpen,
    onClose,
    draggable,
    ...resProps
  } = props;
  const { classPrefix } = useConfig();
  if (resProps.index === undefined) delete resProps.index;
  const { index, next, prev, setIndex } = useIndex(resProps, images);
  const { rotateZ, onResetRotate, onRotate } = useRotate();
  const { scale, zoom, zoomOut, onResetScale } = useScale(imageScale);
  const [isExpand, setIsExpand] = useState(false);

  const onReset = useCallback(() => {
    onResetScale();
    onResetRotate();
  }, [onResetScale, onResetRotate]);

  const onScroll: WheelEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { deltaY } = e;
      deltaY > 0 ? zoom() : zoomOut();
    },
    [zoom, zoomOut],
  );

  const onKeyDown = useCallback(
    (event) => {
      switch (event.code) {
        case 'ArrowRight':
          return next();
        case 'ArrowLeft':
          return prev();
        case 'ArrowUp':
          return zoom();
        case 'ArrowDown':
          return zoomOut();
        case 'Escape':
          return onClose && onClose();
      }
    },
    [next, onClose, prev, zoom, zoomOut],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    onReset();
  }, [index, onReset]);

  if (!isArray(images) || images.length < 1) return null;

  const item: ImageInfo = images[index];

  if (isMini) {
    return (
      <ImageModelMini
        draggable={draggable}
        index={index}
        images={images}
        imageScale={imageScale}
        viewerScale={viewerScale}
        onScroll={onScroll}
        onClose={onClose}
        rotateZ={rotateZ}
        item={item}
        prev={prev}
        next={next}
        zoom={zoom}
        zoomOut={zoomOut}
        onReset={onReset}
        onRotate={onRotate}
        zIndex={zIndex}
      />
    );
  }

  // boolean控制显示，tnode直接展示
  let closeNode: TNode = closeBtn;
  if (closeBtn === true) {
    closeNode = (
      <ImageModelIcon
        name="close"
        className={`${classPrefix}-image-viewer-modal-close-bt`}
        onClick={() => onClose && onClose()}
      />
    );
  } else if (isFunction(closeBtn)) closeNode = closeBtn({ onClose, onOpen });

  return (
    <div className={`${classPrefix}-image-viewer-preview-image`} onWheel={onScroll} style={{ zIndex }}>
      <div
        className={`${classPrefix}-image-viewer-modal-mask`}
        onClick={() => closeOnOverlay && onClose && onClose()}
      />
      {images.length > 1 && (
        <>
          <div className={`${classPrefix}-image-viewer-modal-index`}>{`${index + 1}/${images.length}`}</div>
          <ImageModelIcon
            name="chevron-left-circle"
            className={`${classPrefix}-image-viewer-modal-prev-bt`}
            onClick={prev}
            disabled={index <= 0}
          />
          <ImageModelIcon
            name="chevron-right-circle"
            className={`${classPrefix}-image-viewer-modal-next-bt`}
            onClick={next}
            disabled={index >= images.length - 1}
          />
        </>
      )}
      {closeNode}
      <div className={`${classPrefix}-image-viewer-modal-footer`}>
        <div className={`${classPrefix}-image-viewer-footer__content`}>
          <ImageModelIcon size="1.8em" name="history" onClick={() => onRotate(-ROTATE_COUNT)} />
          <ImageModelIcon size="2em" name="zoom-in" onClick={zoom} />
          <ImageModelIcon size="2em" name="zoom-out" onClick={zoomOut} />
          <ImageModelIcon
            size="1.5em"
            name="image"
            label="原始大小"
            onClick={() => {
              onReset();
            }}
          />
          {item.download && (
            <ImageModelIcon
              size="1.5em"
              name="download"
              label="保存图片"
              onClick={() => {
                downloadFile(item.mainImage);
              }}
            />
          )}
          {images.length > 1 && (
            <ImageModelIcon
              size="1.5em"
              name="chevron-down-circle"
              isRange={isExpand}
              label="展开图片列表"
              onClick={() => {
                setIsExpand(!isExpand);
              }}
            />
          )}
        </div>
        {isExpand && (
          <div className={`${classPrefix}-image-viewer-footer__prev`}>
            {images.map((item, index) => (
              <img
                key={item.thumbnail || item.mainImage}
                alt=""
                src={item.thumbnail || item.mainImage}
                className={`${classPrefix}-image-viewer-footer__img`}
                onClick={() => setIndex(index)}
              />
            ))}
          </div>
        )}
        {/* <IconFont size="3em" name="page-last" onClick={() => onRotate(ROTATE_COUNT)} /> */}
      </div>
      <ImageModelItem scale={scale} rotateZ={rotateZ} preSrc={item.thumbnail} src={item.mainImage} />
    </div>
  );
};
