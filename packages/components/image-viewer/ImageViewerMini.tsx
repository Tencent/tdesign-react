import React, { KeyboardEvent, MouseEvent } from 'react';
import { TNode } from '../common';
import Dialog from '../dialog';
import useConfig from '../hooks/useConfig';
import { ImageModalItem, ImageViewerUtils } from './ImageViewerModal';
import type { ImageInfo, ImageScale, ImageViewerScale, TdImageViewerProps } from './type';

export interface ImageModalMiniProps {
  visible: boolean;
  title?: TNode;
  draggable: boolean;
  index: number;
  scale: number;
  mirror: number;
  images: ImageInfo[];
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  rotateZ: number;
  currentImage: ImageInfo;
  zIndex: number;
  errorText: string;
  tipText: {
    mirror: string;
    rotate: string;
    originalSize: string;
  };
  imageReferrerpolicy?: TdImageViewerProps['imageReferrerpolicy'];
  prev: () => void;
  next: () => void;
  onMirror: () => void;
  onZoom: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRotate: (red: number) => void;
  onClose: (context: { trigger: 'close-btn' | 'overlay' | 'esc'; e: MouseEvent<HTMLElement> | KeyboardEvent }) => void;
}

export const ImageModalMiniContent: React.FC<ImageModalMiniProps> = (props) => {
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-image-viewer-mini__content`}>
      <ImageModalItem
        rotateZ={props.rotateZ}
        scale={props.scale}
        mirror={props.mirror}
        src={props.currentImage.mainImage}
        preSrc={props.currentImage.thumbnail}
        errorText={props.errorText}
        imageReferrerpolicy={props.imageReferrerpolicy}
        isSvg={props.currentImage.isSvg}
      />
    </div>
  );
};

export const ImageModalMini: React.FC<ImageModalMiniProps> = (props) => {
  const {
    visible,
    title,
    scale,
    currentImage,
    draggable,
    tipText,
    onZoomOut,
    onZoom,
    onClose,
    onRotate,
    onMirror,
    onReset,
  } = props;

  const { classPrefix } = useConfig();

  const footer = (
    <div className={`${classPrefix}-image-viewer-mini__footer`}>
      <ImageViewerUtils
        scale={scale}
        tipText={tipText}
        currentImage={currentImage}
        zIndex={props.zIndex + 1}
        onZoom={onZoom}
        onZoomOut={onZoomOut}
        onRotate={onRotate}
        onMirror={onMirror}
        onReset={onReset}
      />
    </div>
  );

  return (
    <Dialog
      className={`${classPrefix}-image-viewer__dialog`}
      draggable={draggable}
      visible={visible}
      width="min(90vw, 1000px)"
      placement="center"
      mode="modeless"
      closeOnOverlayClick={false}
      cancelBtn={null}
      confirmBtn={null}
      header={<span className={`${classPrefix}-image-viewer__dialog-title`}>{title}</span>}
      footer={footer}
      onClose={onClose}
    >
      <ImageModalMiniContent {...props} />
    </Dialog>
  );
};
