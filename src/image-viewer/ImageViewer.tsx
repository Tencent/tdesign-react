import React from 'react';
import { createPortal } from 'react-dom';
import isFunction from 'lodash/isFunction';
import { TdImageViewerProps } from './type';
import { ImageModal } from './ImageViewerModel';
import useConfig from '../_util/useConfig';
import { StyledProps, TNode } from '../common';
import { imageViewerDefaultProps } from './defaultProps';
import useImageScale from './hooks/useImageScale';
import useList from './hooks/useList';
import useViewerScale from './hooks/useViewerScale';
import useControlled from '../hooks/useControlled';
import noop from '../_util/noop';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const ImageViewer = (props: ImageViewerProps) => {
  const { mode, trigger, images, imageScale: imageScaleD, viewerScale: viewerScaleD, showOverlay } = props;

  const { classPrefix } = useConfig();
  const [visible, setVisible] = useControlled(props, 'visible', noop);
  const list = useList(images);
  const imageScale = useImageScale(imageScaleD);
  const viewerScale = useViewerScale(viewerScaleD);

  const isMini = mode === 'modeless';

  const onClose = () => {
    setVisible(false);
    isFunction(props.onClose) && props.onClose();
  };

  const onOpen = () => {
    if (!images) return;
    setVisible(true);
  };

  const uiImage: TNode = isFunction(trigger) ? trigger({ onOpen, onClose }) : trigger;

  return (
    <>
      {uiImage}
      {visible &&
        createPortal(
          <>
            <ImageModal
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
              onClose={onClose}
              onOpen={onOpen}
            />
            {showOverlay && <div className={`${classPrefix}-image-viewer__mask`} />}
          </>,
          document.body,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

ImageViewer.defaultProps = imageViewerDefaultProps;

export default ImageViewer;
