import React, { KeyboardEvent, MouseEvent } from 'react';
import { TNode } from 'tdesign-react/common';
import Dialog from '../dialog';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelItem, ImageViewerUtils } from './ImageViewerModel';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export interface ImageModelMiniProps {
  visible: boolean;
  title?: TNode;
  draggable: boolean;
  index: number;
  scale: number;
  mirror: number;
  images: ImageInfo[];
  onClose: (context: { trigger: 'close-btn' | 'overlay' | 'esc'; e: MouseEvent<HTMLElement> | KeyboardEvent }) => void;
  onScroll: (e: any) => void;
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  rotateZ: number;
  currentImage: ImageInfo;
  prev: () => void;
  next: () => void;
  onMirror: () => void;
  onZoom: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onRotate: (red: number) => void;
  zIndex: number;
  errorText: string;
}

export const ImageModelMiniContent = (props: ImageModelMiniProps) => {
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-image-viewer-mini__content`}>
      <ImageModelItem
        rotateZ={props.rotateZ}
        scale={props.scale}
        mirror={props.mirror}
        src={props.currentImage.mainImage}
        preSrc={props.currentImage.thumbnail}
        errorText={props.errorText}
      />
    </div>
  );
};

export const ImageModelMini = (props: ImageModelMiniProps) => {
  const { visible, title, scale, currentImage, draggable, onZoomOut, onZoom, onClose, onRotate, onMirror, onReset } =
    props;

  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('imageViewer');

  const footer = (
    <div className={`${classPrefix}-image-viewer-mini__footer`}>
      <ImageViewerUtils
        onZoom={onZoom}
        onZoomOut={onZoomOut}
        scale={scale}
        currentImage={currentImage}
        onRotate={onRotate}
        onMirror={onMirror}
        onReset={onReset}
        tipText={{
          mirror: t(locale.mirrorTipText),
          rotate: t(locale.rotateTipText),
          originsize: t(locale.originsizeTipText),
        }}
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
      <ImageModelMiniContent {...props} errorText={t(locale.errorText)} />
    </Dialog>
  );
};
