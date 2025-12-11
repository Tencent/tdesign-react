import React, { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { isFunction, isNumber } from 'lodash-es';

import { formatImages } from '@tdesign/common-js/image-viewer/utils';
import { canUseDocument } from '../_util/dom';
import useAttach from '../hooks/useAttach';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { ImageModal } from './ImageViewerModal';
import { imageViewerDefaultProps } from './defaultProps';
import useImageScale from './hooks/useImageScale';
import useIndex from './hooks/useIndex';
import useViewerScale from './hooks/useViewerScale';
import { DefaultTrigger } from './defaultTrigger';

import type { StyledProps, TNode } from '../common';
import type { ImageModalProps } from './ImageViewerModal';
import type { TdImageViewerProps } from './type';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const ImageViewer: React.FC<ImageViewerProps> = (originalProps) => {
  const props = useDefaultProps<ImageViewerProps>(originalProps, imageViewerDefaultProps);
  const { attach, mode, trigger, images, title, imageScale: imageScaleD, viewerScale: viewerScaleD } = props;

  const imageViewerAttach = useAttach('imageViewer', attach);
  const [visible, setVisible] = useControlled(props, 'visible', (visible, context) => {
    !visible && props?.onClose?.(context);
  });

  const [visibled, setVisibled] = useState(false);
  const imageList = useMemo(() => formatImages(images), [images]);

  const { index, setIndex } = useIndex(props, images);
  const imageScale = useImageScale(imageScaleD);
  const viewerScale = useViewerScale(viewerScaleD);

  const isMini = mode === 'modeless';

  const close: ImageModalProps['onClose'] = useCallback(
    (context) => {
      setVisible(false, context);
      setTimeout(() => setVisibled(false), 196);
    },
    [setVisible],
  );

  const open = useCallback(
    (index?: number) => {
      if (!images) return;
      if (isNumber(index)) {
        setIndex(index);
      }
      setVisible(true, null);
      setVisibled(true);
    },
    [images, setVisible, setIndex],
  );

  const uiImage: TNode = useMemo(() => {
    // 如果 trigger 为空，则使用默认触发器
    if (!trigger && imageList.length) {
      const { mainImage, thumbnail } = imageList[props.defaultIndex || 0] || {};

      const showImage = mainImage || thumbnail;
      return <DefaultTrigger showImage={showImage} onClick={open} />;
    }
    // todo 兼容旧api，新： open close 旧： onOpen, onClose
    // @ts-ignore TODO 待类型完善后移除
    return isFunction(trigger) ? trigger({ open, close, onOpen: open, onClose: close }) : trigger;
  }, [close, imageList, open, props.defaultIndex, trigger]);

  const attachElement = useMemo(() => {
    if (!canUseDocument || !imageViewerAttach) return null;

    if (typeof imageViewerAttach === 'string') {
      return document.querySelector(imageViewerAttach);
    }
    if (isFunction(imageViewerAttach)) {
      return imageViewerAttach();
    }
  }, [imageViewerAttach]);

  return (
    <>
      {uiImage}
      {(visibled || visible) &&
        createPortal(
          <ImageModal
            title={title}
            visible={visible}
            images={imageList}
            isMini={isMini}
            imageScale={imageScale}
            viewerScale={viewerScale}
            zIndex={props.zIndex}
            defaultIndex={props.defaultIndex}
            index={index}
            onIndexChange={setIndex}
            onDownload={props.onDownload}
            draggable={props.draggable}
            closeOnOverlay={props.closeOnOverlay}
            closeBtn={props.closeBtn}
            showOverlay={props.showOverlay}
            closeOnEscKeydown={props.closeOnEscKeydown}
            onClose={close}
            onOpen={open}
            imageReferrerpolicy={props.imageReferrerpolicy}
          />,
          attachElement,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;
