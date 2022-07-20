import React, { useState, useEffect, useCallback, WheelEventHandler } from 'react';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import { Tooltip } from 'tdesign-react';
import { IconFont, Icon } from 'tdesign-icons-react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TNode } from '../common';
import { downloadFile } from './useHooks';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelMini } from './ImageViewerMini';
import useMirror from './hooks/useMirror';
import usePosition from './hooks/usePosition';
import useIndex from './hooks/useIndex';
import useRotate from './hooks/useRotate';
import useScale from './hooks/useScale';

const ImageError = () => {
  const { classPrefix } = useConfig();
  return (
    <div className={`${classPrefix}-image-viewer__img-error`}>
      {/* 脱离文档流 */}
      <div className={`${classPrefix}-image-viewer__img-error--content`}>
        <IconFont name="image" size="4em" />
        <div className={`${classPrefix}-image-viewer__img-error--text`}>图片加载失败，可尝试重新加载</div>
      </div>
    </div>
  );
};

interface ImageModelItemProps {
  rotateZ: number;
  scale: number;
  mirror: number;
  src: string;
  preSrc?: string;
}

// 单个弹窗实例
export const ImageModelItem = ({ rotateZ, scale, src, preSrc, mirror }: ImageModelItemProps) => {
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

  return (
    <div className={`${classPrefix}-image-viewer__modal--pic`}>
      <div className={`${classPrefix}-image-viewer__modal--box`} style={boxStyle}>
        {error && <ImageError />}
        {!error && !!preSrc && (
          <img
            className={`${classPrefix}-image-viewer__modal--image`}
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
        {!error && (
          <img
            className={`${classPrefix}-image-viewer__modal--image`}
            onMouseDown={(event) => {
              event.stopPropagation();
              onMouseDown(event);
            }}
            src={src}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={imgStyle}
            data-testid="img-drag"
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

interface ImageModelIconProps {
  name?: string;
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
      {name && <IconFont size={size} name={name} className={isRange ? 'is-range' : null} />}
      {label && <span className={`${classPrefix}-image-viewer-modal__icon-label`}>{label}</span>}
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
}

export const ImageViewerUtils = ({
  onZoom,
  scale,
  onZoomOut,
  currentImage,
  onRotate,
  onMirror,
  onReset,
}: ImageViewerUtilsProps) => {
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-image-viewer-utils`}>
      <div className={`${classPrefix}-image-viewer-utils__content`}>
        <ImageModelIcon size="1.5em" name="rotation" onClick={() => onRotate(-ROTATE_COUNT)} />
        <ImageModelIcon size="1.5em" name="mirror" onClick={onMirror} />
        <ImageModelIcon size="1.5em" name="zoom-out" onClick={onZoomOut} />
        <ImageModelIcon
          className={`${classPrefix}-image-viewer__utils--scale`}
          size="1.5em"
          label={`${scale * 100}%`}
        />
        <ImageModelIcon size="1.5em" name="zoom-in" onClick={onZoom} />
        <Tooltip content="原始大小" destroyOnClose placement="top" showArrow theme="default">
          <div className={`${classPrefix}-image-viewer-modal__icon`}>
            <Icon
              size="1.5em"
              name="image"
              onClick={() => {
                onReset();
              }}
            />
          </div>
        </Tooltip>
        {currentImage.download && (
          <ImageModelIcon
            size="1.5em"
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
  onImgClick: (index: number) => void;
  images: ImageInfo[];
  currentIndex: number;
};

const ImageViewerHeader = (props: ImageViewerHeaderProps) => {
  const { classPrefix } = useConfig();
  const { images, currentIndex, onImgClick } = props;

  const [isExpand, setIsExpand] = useState(true);

  const transStyle = { transform: `translateX(-${currentIndex * 80}px)` };

  return (
    <div
      className={classNames(`${classPrefix}-image-viewer__modal-header`, {
        [`${classPrefix}-is-show`]: isExpand,
      })}
    >
      <ImageModelIcon
        size="1.5em"
        name="chevron-down"
        className={`${classPrefix}-image-viewer__header--pre__bt`}
        onClick={() => setIsExpand(!isExpand)}
      />
      <div className={`${classPrefix}-image-viewer__header--prev`}>
        <div className={`${classPrefix}-image-viewer__bokeh--left`} />
        <div className={`${classPrefix}-image-viewer__bokeh--right`} />
        <div className={`${classPrefix}-image-viewer__header--trans`} style={transStyle}>
          {images.map((image, index) => (
            <div
              key={index}
              className={classNames(`${classPrefix}-image-viewer__header--box`, {
                [`${classPrefix}-is-active`]: index === currentIndex,
              })}
            >
              <img
                alt=""
                src={image.thumbnail || image.mainImage}
                className={`${classPrefix}-image-viewer__header--img`}
                onClick={() => onImgClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
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
    draggable,
    onOpen,
    onClose,
    ...resProps
  } = props;
  const { classPrefix } = useConfig();
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

  const onScroll: WheelEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { deltaY } = e;
      deltaY > 0 ? onZoom() : onZoomOut();
    },
    [onZoom, onZoomOut],
  );

  const onKeyDown = useCallback(
    (event) => {
      switch (event.code) {
        case 'ArrowRight':
          return next();
        case 'ArrowLeft':
          return prev();
        case 'ArrowUp':
          return onZoom();
        case 'ArrowDown':
          return onZoomOut();
        case 'Escape':
          return onClose?.();
      }
    },
    [next, onClose, prev, onZoom, onZoomOut],
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

  if (isMini) {
    return (
      <ImageModelMini
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
        onMirror={onMirror}
        onZoom={onZoom}
        onClose={onClose}
        onZoomOut={onZoomOut}
        onScroll={onScroll}
        onReset={onReset}
        onRotate={onRotate}
      />
    );
  }

  // boolean控制显示，tnode直接展示
  let closeNode: TNode = closeBtn;
  if (closeBtn === true) {
    closeNode = (
      <ImageModelIcon
        name="close"
        size="1.5em"
        className={`${classPrefix}-image-viewer-modal-close-bt`}
        onClick={() => onClose && onClose()}
      />
    );
  } else if (isFunction(closeBtn)) closeNode = closeBtn({ onClose, onOpen });

  return (
    <div className={`${classPrefix}-image-viewer-preview-image`} onWheel={onScroll} style={{ zIndex }}>
      <div className={`${classPrefix}-image-viewer__modal--mask`} onClick={() => closeOnOverlay && onClose?.()} />
      {images.length > 1 && (
        <>
          <ImageViewerHeader images={images} currentIndex={index} onImgClick={setIndex} />
          <div className={`${classPrefix}-image-viewer__modal--index`}>{`${index + 1}/${images.length}`}</div>
          <ImageModelIcon
            size="1.5em"
            name="chevron-left"
            className={`${classPrefix}-image-viewer-modal-prev-bt`}
            onClick={prev}
            disabled={index <= 0}
          />
          <ImageModelIcon
            size="1.5em"
            name="chevron-right"
            className={`${classPrefix}-image-viewer-modal-next-bt`}
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
      />
      {closeNode}
      <ImageModelItem
        scale={scale}
        rotateZ={rotateZ}
        mirror={mirror}
        preSrc={currentImage.thumbnail}
        src={currentImage.mainImage}
      />
    </div>
  );
};
