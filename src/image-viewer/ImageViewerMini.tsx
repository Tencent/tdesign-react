import React, { KeyboardEvent, MouseEvent } from 'react';
import { CloseIcon as TdCloseIcon } from 'tdesign-icons-react';
import Dialog from '../dialog';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelItem, ImageViewerUtils } from './ImageViewerModel';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';

export interface ImageModelMiniProps {
  visible: boolean;
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
  const { visible, index, images, scale, currentImage, onZoomOut, onZoom, onClose, onRotate, onMirror, onReset } =
    props;

  const { classPrefix } = useConfig();
  const { CloseIcon } = useGlobalIcon({ CloseIcon: TdCloseIcon });

  const header = (
    <div className={`${classPrefix}-image-viewer__mini--header`}>
      {`${index + 1}/${images.length}`}
      <span className={`${classPrefix}-image-viewer__mini--close`}>
        <CloseIcon size="1.5rem" onClick={(e: MouseEvent<any>) => onClose({ trigger: 'close-btn', e })} />
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
      visible={visible}
      width="min(90vw, 1000px)"
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
