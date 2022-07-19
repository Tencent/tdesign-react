import React from 'react';
import { ImageViewer } from 'tdesign-react';
import img from '../img/img.png';

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => (
    <div className={`t-image-viewer-ui-image`}>
      <img
        alt={'test'}
        src={img}
        onClick={onOpen}
        className={`t-image-viewer-ui-image-img`}
      />
    </div>
  )

  const style = {width: '160px', height: '160px'}

  return (
    <div style={style}>
      <ImageViewer draggable mode="modeless" trigger={trigger} images={[img]}/>
    </div>
  );
}
