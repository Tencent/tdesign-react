import React from 'react';
import { Dialog } from 'tdesign-react';
import { ImageInfo, ImageScale, ImageViewerScale } from './type';
import { ImageModelItem } from './ImageViewerModel';

export interface ImageModelMiniProps {
  draggable: boolean;
  index: number;
  images: ImageInfo[];
  onClose: () => void;
  onScroll: (e: any) => void;
  imageScale: ImageScale;
  viewerScale: ImageViewerScale;
  rotateZ: number;
  item: ImageInfo;
  prev: () => void;
  next: () => void;
  zoom: () => void;
  zoomOut: () => void;
  onReset: () => void;
  onRotate: (red: number) => void;
  zIndex: number;
}

export const ImageModelMiniContent = (props: ImageModelMiniProps) => (
  <div style={{ maxWidth: '100%', maxHeight: '80vh' }}>
    <ImageModelItem rotateZ={0} scale={1} src={props.item.mainImage} preSrc={props.item.thumbnail} />
  </div>
);

export const ImageModelMini = (props: ImageModelMiniProps) => (
  <Dialog
    draggable
    visible
    width="1000px"
    placement="center"
    mode="modeless"
    cancelBtn={null}
    confirmBtn={null}
    header={'预览'}
    onClose={props.onClose}
  >
    <ImageModelMiniContent {...props} />
  </Dialog>
);
