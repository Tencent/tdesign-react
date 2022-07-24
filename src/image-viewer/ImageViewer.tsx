import React from 'react';
import { createPortal } from 'react-dom';
import isFunction from 'lodash/isFunction';
import { TdImageViewerProps } from './type';
import { ImageModal } from './ImageViewerModel';
import { StyledProps, TNode } from '../common';
import { imageViewerDefaultProps } from './defaultProps';
import useImageScale from './hooks/useImageScale';
import useList from './hooks/useList';
import useViewerScale from './hooks/useViewerScale';
import useControlled from '../hooks/useControlled';

export interface ImageViewerProps extends TdImageViewerProps, StyledProps {}

const ImageViewer = (props: ImageViewerProps) => {
  const { mode, trigger, images, imageScale: imageScaleD, viewerScale: viewerScaleD } = props;

  const [visible, setVisible] = useControlled<boolean, any>(props, 'visible', (visible, context) => {
    isFunction(props.onClose) && props.onClose(context);
  });
  const list = useList(images);
  const imageScale = useImageScale(imageScaleD);
  const viewerScale = useViewerScale(viewerScaleD);

  const isMini = mode === 'modeless';

  const onClose = (context) => {
    setVisible(false, context);
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
            showOverlay={props.showOverlay}
            onClose={onClose}
            onOpen={onOpen}
          />,
          document.body,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

ImageViewer.defaultProps = imageViewerDefaultProps;

export default ImageViewer;
