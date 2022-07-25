import React from 'react';
import { ImageViewer } from 'tdesign-react';
import {BrowseIcon} from 'tdesign-icons-react';
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';
import './style.less';

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

  return (
    <>
      {images.map((imgSrc, index) => {
        const trigger = ({onOpen}) => (
          <div className={`t-image-viewer__ui-image t-image-viewer__base`}>
            <img
              alt={'test'}
              src={ imgSrc?.mainImage || imgSrc }
              className={`t-image-viewer__ui-image--img`}
            />
            <div className={`t-image-viewer__ui-image--hover`} onClick={onOpen}>
              <span><BrowseIcon size="1.4em"/> 预览</span>
            </div>
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
