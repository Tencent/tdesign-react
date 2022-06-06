import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { isFunction } from 'lodash';
import { TdImageViewerProps } from './type';
import { ImageModal } from './ImageViewerModel';
import useConfig from '../_util/useConfig';
import { StyledProps, TNode } from '../common';
import { imageViewerDefaultProps } from './defaultProps';
import { useImageScale, useList, useViewerScale } from './useHooks';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const ImageViewer = (props: ImageViewerProps) => {
  const {
    mode,
    trigger,
    defaultVisible,
    images,
    imageScale: imageScaleD,
    viewerScale: viewerScaleD,
    showOverlay,
  } = props;

  const { classPrefix } = useConfig();
  const [visible, setVisible] = useState(defaultVisible);
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
              draggable={props.draggable}
              closeOnOverlay={props.closeOnOverlay}
              closeBtn={props.closeBtn}
              onClose={onClose}
              onOpen={onOpen}
            />
            {showOverlay && <div className={`${classPrefix}-image-viewer-mask`} />}
          </>,
          document.body,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

ImageViewer.defaultProps = imageViewerDefaultProps;

export default ImageViewer;
