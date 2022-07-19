import React from 'react';
import { ImageViewer } from 'tdesign-react';
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => (
    <div className={`t-image-viewer-ui-image`}>
      <img
        alt={'test'}
        src={img}
        onClick={onOpen}
        className={`t-image-viewer-ui-image-img`}
      />
      <div className={`t-image-viewer-ui-image-footer`}>
        <span className={`t-image-viewer-ui-image-title`}>相册封面标题</span>
      </div>
    </div>
  )

  const images = [
    img,
    imgV,
    imgH,
  ]

  const style = {width: '160px', height: '160px'}

  return (
    <div style={style}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
