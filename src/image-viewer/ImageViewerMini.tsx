import React from 'react';
import { Dialog } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelItem, ImageViewerUtils } from './ImageViewerModel';
import useConfig from '../_util/useConfig';

export interface ImageModelMiniProps {
  draggable: boolean;
  index: number;
  scale: number;
  mirror: number;
  images: ImageInfo[];
  onClose: () => void;
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
      />
    </div>
  );
};

const DIALOG_CSS_PADDING = {
  padding: 0,
};

export const ImageModelMini = (props: ImageModelMiniProps) => {
  const { index, images, onZoom, onClose, scale, onZoomOut, currentImage, onRotate, onMirror, onReset } = props;

  const { classPrefix } = useConfig();

  const header = (
    <div className={`${classPrefix}-image-viewer-mini__header`}>
      {`${index + 1}/${images.length}`}
      <span className={`${classPrefix}-image-viewer-mini__close`}>
        <IconFont size="1.5rem" name="close" onClick={onClose} />
      </span>
    </div>
  );

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
      />
    </div>
  );

  return (
    <Dialog
      className={`${classPrefix}-image-viewer__dialog`}
      draggable
      visible
      width="1000px"
      placement="center"
      mode="modeless"
      cancelBtn={null}
      confirmBtn={null}
      closeBtn={false}
      header={header}
      footer={footer}
      onClose={onClose}
      style={DIALOG_CSS_PADDING}
    >
      <ImageModelMiniContent {...props} />
    </Dialog>
  );
};
