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
    </div>
  )

  const images = [{
    mainImage: imgV,
    thumbnail: img
  }]

  const UIImageStyle = {width: '160px', height: '160px', marginRight: '50px'}

  return (
    <>
      <div style={UIImageStyle} className="t-image-viewer-ui-image">
        <ImageViewer trigger={trigger} images={images}/>
      </div>
      <div style={UIImageStyle} className="t-image-viewer-ui-image">
        <ImageViewer trigger={trigger} images={[images[0].mainImage]}/>
      </div>
    </>
  );
}
