import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { isArray, isFunction } from 'lodash-es';
import {
  ImageErrorIcon as TdImageErrorIcon,
  ImageIcon as TdImageIcon,
  MirrorIcon as TdMirrorIcon,
  RotationIcon as TdRotationIcon,
} from 'tdesign-icons-react';
import { isImageExceedsViewport } from '@tdesign/common-js/image-viewer/transform';
import { downloadImage } from '@tdesign/common-js/image-viewer/utils';
import { largeNumberToFixed } from '@tdesign/common-js/input-number/large-number';

import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import useImagePreviewUrl from '../hooks/useImagePreviewUrl';
import Image from '../image';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { TooltipLite } from '../tooltip';
import useIconMap from './hooks/useIconMap';
import useIndex from './hooks/useIndex';
import useMirror from './hooks/useMirror';
import usePosition from './hooks/usePosition';
import useRotate from './hooks/useRotate';
import useScale from './hooks/useScale';
import { ImageModalMini } from './ImageViewerMini';

import type { TNode } from '../common';
import type { PositionType } from './hooks/usePosition';
import type { ImageViewerProps } from './ImageViewer';
import type { ImageInfo, ImageScale, ImageViewerScale, TdImageViewerProps } from './type';

/** ImageModalItem 暴露给父组件的接口 */
export interface ImageModalItemRef {
  /** modal-box 容器 DOM 引用 */
  modalBoxRef: React.RefObject<HTMLDivElement>;
  /** 当前位移（ref，始终最新） */
  positionRef: React.RefObject<PositionType>;
  /** 设置位移 */
  setPosition: React.Dispatch<React.SetStateAction<PositionType>>;
  /** 重置位移 */
  resetPosition: () => void;
  /** 是否正在拖拽（ref，始终最新） */
  isDraggingRef: React.RefObject<boolean>;
  /** 启用向中心缩放动画（CSS 类名驱动） */
  enableTransition: () => void;
}

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
  innerClassName: TdImageViewerProps['innerClassName'];
}

// 单个弹窗实例
export const ImageModalItem = React.forwardRef<ImageModalItemRef, ImageModalItemProps>(
  ({ rotateZ, scale, src, preSrc, mirror, errorText, imageReferrerpolicy, isSvg, innerClassName }, ref) => {
    const { classPrefix } = useConfig();

    const imgRef = useRef<HTMLImageElement>(null);
    const svgRef = useRef<HTMLDivElement>(null);
    const modalBoxRef = useRef<HTMLDivElement>(null);

    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const imgStyle: React.CSSProperties = {
      transform: `rotateZ(${rotateZ}deg) scale(${scale})`,
      display: !preSrc || loaded ? 'block' : 'none',
    };

    const { previewUrl: preSrcImagePreviewUrl } = useImagePreviewUrl(preSrc);
    const { previewUrl: mainImagePreviewUrl } = useImagePreviewUrl(src);

    const displayRef = useMemo(() => {
      if (isSvg) return svgRef;
      return imgRef;
    }, [isSvg]);
    const { position, setPosition, resetPosition, isDragging } = usePosition(displayRef);
    const positionRef = useRef(position);
    positionRef.current = position;
    const isDraggingRef = useRef(isDragging);
    isDraggingRef.current = isDragging;

    const preImgStyle: React.CSSProperties = {
      transform: `rotateZ(${rotateZ}deg) scale(${scale})`,
      display: !loaded ? 'block' : 'none',
    };
    const boxStyle: React.CSSProperties = {
      transform: `translate(${position[0]}px, ${position[1]}px) scale(${mirror}, 1)`,
    };

    const transitioningClass = `${classPrefix}-image-viewer__modal-box--transitioning`;
    const transitionEndHandlerRef = useRef<((e: TransitionEvent) => void) | null>(null);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const cleanupTransition = useCallback(() => {
      const modalBox = modalBoxRef.current;
      if (transitionEndHandlerRef.current && modalBox) {
        modalBox.removeEventListener('transitionend', transitionEndHandlerRef.current);
      }
      transitionEndHandlerRef.current = null;
      clearTimeout(fallbackTimerRef.current);
      modalBox?.classList.remove(transitioningClass);
    }, [transitioningClass]);

    const enableTransition = useCallback(() => {
      const modalBox = modalBoxRef.current;
      if (!modalBox) return;

      modalBox.classList.add(transitioningClass);

      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = setTimeout(cleanupTransition, 350);

      const handleTransitionEnd = (e: TransitionEvent) => {
        if (e.propertyName !== 'transform') return;
        cleanupTransition();
      };
      if (transitionEndHandlerRef.current) {
        modalBox.removeEventListener('transitionend', transitionEndHandlerRef.current);
      }
      transitionEndHandlerRef.current = handleTransitionEnd;
      modalBox.addEventListener('transitionend', handleTransitionEnd);
    }, [transitioningClass, cleanupTransition]);

    useEffect(() => cleanupTransition, [cleanupTransition]);

    useImperativeHandle(
      ref,
      () => ({
        modalBoxRef,
        positionRef,
        setPosition,
        resetPosition,
        isDraggingRef,
        enableTransition,
      }),
      [setPosition, resetPosition, enableTransition],
    );

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
      <div className={classNames(`${classPrefix}-image-viewer__modal-pic`, innerClassName)}>
        <div ref={modalBoxRef} className={`${classPrefix}-image-viewer__modal-box`} style={boxStyle}>
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
  },
);

ImageModalItem.displayName = 'ImageModalItem';

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
  onRotate: () => void;
  onZoomIn: () => void;
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
  onZoomIn,
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
          <div className={`${classPrefix}-image-viewer__modal-icon`} onClick={() => onRotate()}>
            <RotationIcon size="medium" />
          </div>
        </TooltipLite>
        <ImageModalIcon size="medium" name="zoom-out" onClick={onZoomOut} />
        <ImageModalIcon
          className={`${classPrefix}-image-viewer__utils-scale`}
          size="medium"
          label={`${largeNumberToFixed(String(scale * 100))}%`}
        />
        <ImageModalIcon size="medium" name="zoom-in" onClick={onZoomIn} />
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
  className?: string;
  style?: React.CSSProperties;
  onClose: (context: {
    trigger: 'close-btn' | 'overlay' | 'esc';
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent;
  }) => void;
  onOpen: () => void;
  onDownload?: TdImageViewerProps['onDownload'];
  onIndexChange?: (index: number, context: { trigger: 'prev' | 'next' | 'current' }) => void;
  innerClassName?: TdImageViewerProps['innerClassName'];
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
    className,
    style,
    onOpen,
    onClose,
    onDownload,
    onIndexChange,
    innerClassName,
  } = props;
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('imageViewer');

  const { next, prev } = useIndex(props, images);
  const { rotateZ, onResetRotate, onRotate } = useRotate();
  const { mirror, onResetMirror, onMirror } = useMirror();

  const containerRef = useRef<HTMLDivElement>(null);
  const imageItemRef = useRef<ImageModalItemRef>(null);

  // handleWheel 先用 ref 占位，useScale 之后再赋值，避免循环依赖
  const handleWheelRef = useRef<(e: WheelEvent) => void>(null);
  const stableHandleWheel = useCallback((e: WheelEvent) => handleWheelRef.current?.(e), []);

  const { scale, onZoomIn, onZoomOut, onResetScale } = useScale(imageScale, visible, stableHandleWheel);

  // ⚠️ 不能用 React 的 onWheel —— React 17+ 将 wheel 注册为 passive: true，
  //    导致 e.preventDefault() 无效，无法阻止页面滚动。
  handleWheelRef.current = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();

      const isZoomOut = e.deltaY > 0;
      const container = containerRef.current;
      const modalBox = imageItemRef.current?.modalBoxRef?.current;

      if (isZoomOut && container && modalBox && isImageExceedsViewport(container, modalBox)) {
        const currentPosition = imageItemRef.current?.positionRef?.current ?? [0, 0];
        const result = onZoomOut({
          mouseOffsetX: 0,
          mouseOffsetY: 0,
          currentTranslate: {
            translateX: currentPosition[0],
            translateY: currentPosition[1],
          },
        });
        if (result?.newTranslate) {
          imageItemRef.current?.enableTransition?.();
          imageItemRef.current?.setPosition?.([result.newTranslate.translateX, result.newTranslate.translateY]);
        }
      } else {
        isZoomOut ? onZoomOut() : onZoomIn();
      }
    },
    [onZoomIn, onZoomOut],
  );

  // imageScale 动态变化时重置缩放
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onResetScale();
  }, [imageScale, onResetScale]);

  const onReset = useCallback(() => {
    onResetScale();
    onResetRotate();
    onResetMirror();
    imageItemRef.current?.resetPosition?.();
  }, [onResetMirror, onResetScale, onResetRotate]);

  // 用 ref 保存最新的 handlers，避免 keydown listener 因闭包 stale 而丢失事件
  const keyHandlersRef = useRef({ next, prev, onZoomIn, onZoomOut, onClose, closeOnEscKeydown });
  keyHandlersRef.current = { next, prev, onZoomIn, onZoomOut, onClose, closeOnEscKeydown };

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const handlers = keyHandlersRef.current;
    const keyActionMap: Partial<Record<string, () => void>> = {
      ArrowRight: () => handlers.next(),
      ArrowLeft: () => handlers.prev(),
      ArrowUp: () => handlers.onZoomIn(),
      ArrowDown: () => handlers.onZoomOut(),
      Escape: () => handlers.closeOnEscKeydown && handlers.onClose?.({ trigger: 'esc', e: event as any }),
    };
    keyActionMap[event.key]?.();
  }, []);

  // 弹窗可见时绑定键盘事件，关闭后解绑
  useEffect(() => {
    if (!visible) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, onKeyDown]);

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
        innerClassName={innerClassName}
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
        className={className}
        style={style}
        prev={prev}
        next={next}
        onMirror={onMirror}
        onRotate={onRotate}
        onZoomIn={onZoomIn}
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
      ref={containerRef}
      className={classNames(
        `${classPrefix}-image-viewer-preview-image`,
        {
          [`${classPrefix}-is-hide`]: !visible,
        },
        className,
      )}
      style={{ zIndex, ...style }}
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
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onDownload={onDownload}
        onRotate={onRotate}
        onMirror={onMirror}
        onReset={onReset}
      />
      {closeNode}
      <ImageModalItem
        ref={imageItemRef}
        innerClassName={innerClassName}
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
