import React from 'react';
import { ImageViewer } from 'tdesign-react';
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';

export default function BasicImageViewer() {
  const images = [
    img,
    {
      mainImage: imgH,
      download: true,
      thumbnail: imgH,
    },
    imgV,
  ]

  const style = {
    height: '160px',
    width: '160px',
    margin: '10px'
  }

  return (
    <>
      {images.map((imgSrc, index) => {
        const trigger = ({onOpen}) => (
          <div  style={style} className={`t-image-viewer-ui-image`}>
            <img
              alt={'test'}
              src={imgSrc?.mainImage ? imgSrc?.mainImage : imgSrc}
              onClick={onOpen}
              className={`t-image-viewer-ui-image-img`}
            />
          </div>
        )

        return (
          <ImageViewer
            key={imgSrc}
            trigger={trigger}
            images={images}
            defaultIndex={index}
          />
        )
      })}
    </>
  );
}
