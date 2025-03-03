import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { isFunction } from 'lodash-es';
import { ImageModal } from './ImageViewerModal';
import { imageViewerDefaultProps } from './defaultProps';
import type { TdImageViewerProps } from './type';
import type { ImageModalProps } from './ImageViewerModal';
import type { StyledProps, TNode } from '../common';
import useImageScale from './hooks/useImageScale';
import useList from './hooks/useList';
import useViewerScale from './hooks/useViewerScale';
import useControlled from '../hooks/useControlled';
import useDefaultProps from '../hooks/useDefaultProps';
import { canUseDocument } from '../_util/dom';
import useAttach from '../hooks/useAttach';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const ImageViewer: React.FC<ImageViewerProps> = (originalProps) => {
  const props = useDefaultProps<ImageViewerProps>(originalProps, imageViewerDefaultProps);
  const { attach, mode, trigger, images, title, imageScale: imageScaleD, viewerScale: viewerScaleD } = props;

  const imageViewerAttach = useAttach('imageViewer', attach);
  const [visible, setVisible] = useControlled(props, 'visible', (visible, context) => {
    !visible && props?.onClose?.(context);
  });

  const [visibled, setVisibled] = useState(false);
  const list = useList(images);
  const imageScale = useImageScale(imageScaleD);
  const viewerScale = useViewerScale(viewerScaleD);

  const isMini = mode === 'modeless';

  const close: ImageModalProps['onClose'] = (context) => {
    setVisible(false, context);
    setTimeout(() => setVisibled(false), 196);
  };

  const open = () => {
    if (!images) return;
    setVisible(true, null);
    setVisibled(true);
  };
  // todo 兼容旧api，新： open close 旧： onOpen, onClose
  // @ts-ignore TODO 待类型完善后移除
  const uiImage: TNode = isFunction(trigger) ? trigger({ open, close, onOpen: open, onClose: close }) : trigger;

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
            images={list}
            isMini={isMini}
            imageScale={imageScale}
            viewerScale={viewerScale}
            zIndex={props.zIndex}
            defaultIndex={props.defaultIndex}
            index={props.index}
            onIndexChange={props.onIndexChange}
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
