import React, { MouseEvent, useRef, useEffect } from 'react';
import { CloseIcon, DeleteIcon } from 'tdesign-icons-react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionClassNames } from 'react-transition-group/CSSTransition';
import { TdImageViewerProps, ImageInfo, ImageViewerCloseTrigger, ImageSlotParams } from './type';
import { StyledProps } from '../common';
import { usePrefixClass } from '../hooks/useClass';
import useDefault from '../_util/useDefault';
import noop from '../_util/noop';
import useDefaultProps from '../hooks/useDefaultProps';
import { imageViewerDefaultProps } from './defaultProps';
import { Swiper as TSwiper } from '../swiper';
import parseTNode from '../_util/parseTNode';
import TSwiperItem from '../swiper/SwiperItem';
import { useImageTransform } from './transform';
import { useTouchEvent } from './useTouchEvent';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const MIN_SCALE = 1;
const movable = true;
const BASE_SCALE_RATIO = 1;
const scaleStep = 0.5;

const ImageViewer: React.FC<ImageViewerProps> = (props) => {
  const {
    visible,
    defaultVisible,
    onClose,
    index,
    defaultIndex,
    onIndexChange,
    closeBtn,
    deleteBtn,
    onDelete,
    maxZoom,
    cover,
    image,
    loop,
  } = useDefaultProps<ImageViewerProps>(props, imageViewerDefaultProps);

  const [show, setShow] = useDefault<boolean, any>(visible, defaultVisible, noop);
  const [currentIndex, setCurrentIndex] = useDefault(index, defaultIndex, onIndexChange);

  const swiperRootRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<HTMLImageElement[]>([]);
  const duration = 300;
  const { transform, resetTransform, updateTransform, dispatchZoomChange } = useImageTransform(MIN_SCALE, maxZoom);
  const { isTouching, onTouchStart, onTouchMove, onTouchEnd } = useTouchEvent(
    imgRefs,
    movable,
    show, // show
    MIN_SCALE,
    transform,
    updateTransform,
    dispatchZoomChange,
    currentIndex,
    swiperRootRef,
  );

  useEffect(() => {
    if (!show) {
      resetTransform('close');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const imageViewerClass = usePrefixClass('image-viewer');
  const handleClose = (e: MouseEvent, trigger: ImageViewerCloseTrigger) => {
    e.stopPropagation();
    setShow(false);
    onClose?.({ trigger, visible: false, index: currentIndex });
  };

  // 通过(事件委托)将点击事件绑定到组件根，判断点击目标
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      handleClose(e, 'image');
    } else {
      handleClose(e, 'overlay');
    }
  };

  const handleDelete = () => {
    onDelete?.(currentIndex ?? 0);
  };

  const getPreloadImageIndex = () => {
    const lastIndex = props.images.length - 1;
    if ([undefined, 0].includes(currentIndex)) {
      return [0, 1, lastIndex];
    }
    if (currentIndex === lastIndex) {
      return [lastIndex, lastIndex - 1, 0];
    }
    const prev = currentIndex - 1 >= 0 ? currentIndex - 1 : lastIndex;
    const next = currentIndex + 1 <= lastIndex ? currentIndex + 1 : 0;
    return [currentIndex, prev, next];
  };

  const preloadImageIndex = getPreloadImageIndex();

  const imageInfoList = props.images.map((image, index) => {
    let imageInfo: ImageInfo;
    if (typeof image === 'string') {
      imageInfo = {
        url: image,
        align: 'center',
      };
    } else {
      imageInfo = image;
    }
    return {
      image: imageInfo,
      preload: preloadImageIndex.includes(index),
    };
  });

  const onDoubleClick = () => {
    if (show) {
      if (transform.scale !== 1) {
        updateTransform({ x: 0, y: 0, scale: 1 }, 'doubleClick');
      } else {
        dispatchZoomChange(BASE_SCALE_RATIO + scaleStep, 'doubleClick');
      }
    }
  };

  const onSwiperChange = (index: number) => {
    if (!show) return;
    if (transform.scale !== 1) return;

    if (currentIndex !== index) {
      const trigger = currentIndex < index ? 'next' : 'prev';
      setCurrentIndex(index, { trigger });
    }
  };

  const animationClassNames: CSSTransitionClassNames = {
    enterActive: 'fade-enter-active',
    exitActive: 'fade-leave-active',
  };

  const getMaxDraggedX = () => {
    const rootOffsetWidth = rootRef.current?.offsetWidth || 0;
    const scaledWidth = transform.scale * rootOffsetWidth;
    return Math.max(0, (scaledWidth - rootOffsetWidth) / 2);
  };

  const getMaxDraggedY = (index: number) => {
    const rootOffsetHeight = rootRef.current?.offsetHeight || 0;
    const currentImageHeight = imgRefs.current[currentIndex]?.offsetHeight;
    if (!currentImageHeight || !rootOffsetHeight) {
      return {
        top: 0,
        bottom: 0,
      };
    }
    const currentImageScaledHeight = transform.scale * currentImageHeight;
    const halfScaleHeight = (currentImageScaledHeight - currentImageHeight) / 2;
    if (currentImageScaledHeight <= rootOffsetHeight) {
      return {
        top: 0,
        bottom: 0,
      };
    }
    const diffHeight = currentImageScaledHeight - rootOffsetHeight;
    const centerDraggedY = diffHeight / 2;
    const alignmentDraggedY = {
      start: {
        top: -diffHeight + halfScaleHeight,
        bottom: halfScaleHeight,
      },
      center: {
        top: -centerDraggedY,
        bottom: centerDraggedY,
      },
      end: {
        top: -halfScaleHeight,
        bottom: diffHeight - halfScaleHeight,
      },
    };
    const alignment = imageInfoList[index]?.image?.align || 'center';
    return alignmentDraggedY[alignment];
  };

  const getRealTransformX = () => {
    const max = getMaxDraggedX();
    if (transform.x < -max) {
      return -max;
    }
    if (transform.x > max) {
      return max;
    }
    return transform.x;
  };

  const getRealTransformY = (index: number) => {
    const { top, bottom } = getMaxDraggedY(index);
    if (top === bottom) {
      return top;
    }
    if (transform.y < top) {
      return top;
    }
    if (transform.y > bottom) {
      return bottom;
    }
    return transform.y;
  };

  return (
    <CSSTransition
      in={show}
      timeout={duration}
      appear
      unmountOnExit={true}
      mountOnEnter
      classNames={animationClassNames}
      nodeRef={rootRef}
    >
      <div ref={rootRef} className={imageViewerClass} onClick={handleClick}>
        {parseTNode(cover) && <div className={`${imageViewerClass}__cover`}>{parseTNode(cover)}</div>}
        <div className={`${imageViewerClass}__mask`}></div>
        <TSwiper
          ref={swiperRootRef}
          autoplay={false}
          navigation={false}
          height={'100vh'}
          className={`${imageViewerClass}__content`}
          onChange={onSwiperChange}
          current={currentIndex}
          defaultCurrent={currentIndex}
          loop={loop}
          disabled={isTouching.current || transform.scale !== 1}
        >
          {imageInfoList.map((info, index) => (
            <TSwiperItem
              key={index}
              className={`${imageViewerClass}__swiper-item`}
              style={{
                touchAction: 'none',
                alignItems: info.image.align,
                display: 'flex',
                overflow: 'hidden',
              }}
              hostStyle={{ overflow: 'visible' }}
            >
              {(() => {
                const imageSlotParams: ImageSlotParams = {
                  src: info.image.url,
                  index,
                  extra: info.image.extra,
                  className: `${imageViewerClass}__img`,
                  style: `transform: matrix(${transform.scale}, 0, 0, ${transform.scale}, ${getRealTransformX()}, ${getRealTransformY(index)}); transition-duration: ${
                    isTouching ? '0s' : '.3s'
                  };`,
                };

                const defaultImage = (
                  <img
                    src={info.image.url}
                    ref={(node) => {
                      imgRefs.current[index] = node;
                    }}
                    style={{
                      transform: `matrix(${transform.scale}, 0, 0, ${transform.scale}, ${getRealTransformX()}, ${getRealTransformY(index)})`,
                      transitionDuration: isTouching ? '0s' : '.3s',
                    }}
                    className={`${imageViewerClass}__img`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onTouchCancel={onTouchEnd}
                    onDoubleClick={onDoubleClick}
                  />
                );

                return parseTNode(image, imageSlotParams, defaultImage);
              })()}
            </TSwiperItem>
          ))}
        </TSwiper>

        <div className={`${imageViewerClass}__nav`}>
          <div className={`${imageViewerClass}__nav-close`} onClick={(e) => handleClose(e, 'close-btn')}>
            {parseTNode(closeBtn, null, <CloseIcon />)}
          </div>

          {props.showIndex && (
            <div className={`${imageViewerClass}__nav-index`}>
              {`${Math.min((currentIndex ?? 0) + 1, props.images?.length)}/${props.images?.length}`}
            </div>
          )}

          <div className={`${imageViewerClass}__nav-delete`} onClick={handleDelete}>
            {parseTNode(deleteBtn, null, <DeleteIcon />)}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
