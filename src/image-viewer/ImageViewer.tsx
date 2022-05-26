import React, { CSSProperties, ComponentProps, useState } from 'react';
import { createPortal } from 'react-dom';
import { isFunction } from 'lodash';
import { DefaultUIImage, TitleIcons } from './DefaultUIImage';
import { ImageModal } from './ImageViewerModel';
import useConfig from '../_util/useConfig';

export interface TdImageViewerProps extends ComponentProps<any> {
  src?: string;
  alt?: string;
  title?: string;
  titleIcons?: TitleIcons;
  type?: 'mini' | 'normal';
  miniWidth?: number;
  miniHeight?: number;
  movable?: boolean;
  previewSrcList?: string[];
  zIndex?: number;
  style?: CSSProperties;
  // 初始化时图片在队列中位置
  startIndex?: number;
  closeOnMark?: boolean;
  mask?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onClick?: () => void;
  className?: string;
  maxScale?: number;
  scaleStep?: number;
}

export type ImageViewerProps = TdImageViewerProps;

const ImageViewer = (props: ImageViewerProps) => {
  const { type, children, alt, src, style, className, title, titleIcons } = props;

  const { classPrefix } = useConfig();
  const [visible, setVisible] = useState(false);

  const isMini = type === 'mini';

  const onClose = () => {
    setVisible(false);
    isFunction(props.onClose) && props.onClose();
  };

  const onOpen = () => {
    if (!props.previewSrcList) return;
    setVisible(true);
    if (!visible) isFunction(props.onOpen) && props.onOpen();
    isFunction(props.onClick) && props.onClick();
  };

  let uiImage: any = null;
  if (children) {
    if (!isFunction(children)) throw new Error('ImageViewer child needs to pass in a function');
    uiImage = children({ onOpen, onClose });
  } else {
    uiImage = (
      <DefaultUIImage
        list={props.previewSrcList}
        titleIcons={titleIcons}
        alt={alt}
        src={src}
        style={style}
        title={title}
        className={className}
        onOpen={onOpen}
      />
    );
  }

  return (
    <>
      {uiImage}
      {visible &&
        createPortal(
          <>
            <ImageModal
              list={props.previewSrcList}
              isMini={isMini}
              miniWidth={props.miniWidth}
              miniHeight={props.miniHeight}
              zIndex={props.zIndex}
              startIndex={props.startIndex}
              onClose={onClose}
              movable={props.movable}
              closeOnMark={props.closeOnMark}
              maxScale={props.maxScale}
              scaleStep={props.scaleStep}
            />
            {props.mask && <div className={`${classPrefix}-image-viewer-mask`} />}
          </>,
          document.body,
        )}
    </>
  );
};

ImageViewer.displayName = 'ImageViewer';

ImageViewer.defaultProps = {
  miniWidth: 1000,
  miniHeight: 600,
  movable: false,
  previewSrcList: [],
  zIndex: 2000,
  startIndex: 0,
  closeOnMark: true,
  mask: true,
  maxScale: 2,
  scaleStep: 0.5,
  titleIcons: [],
  type: 'normal',
};

export default ImageViewer;
