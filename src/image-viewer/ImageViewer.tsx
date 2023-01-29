import React, { useState } from 'react';
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
  const { mode, trigger, images, title, imageScale: imageScaleD, viewerScale: viewerScaleD } = props;

  const [visible, setVisible] = useControlled(props, 'visible', (visible, context) => {
    isFunction(props.onClose) && props.onClose(context);
  });

  const [visibled, setVisibled] = useState(false);
  const list = useList(images);
  const imageScale = useImageScale(imageScaleD);
  const viewerScale = useViewerScale(viewerScaleD);

  const isMini = mode === 'modeless';

  const close = (context) => {
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

  return (
    <>
      {uiImage}
      {visibled &&
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
            onClose={close}
            onOpen={open}
          />,
          document.body,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

ImageViewer.defaultProps = imageViewerDefaultProps;

export default ImageViewer;
