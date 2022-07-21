import React from 'react';
import { ImageViewer } from 'tdesign-react';
import {Icon} from 'tdesign-icons-react';
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

  const style = {
    height: '160px',
    width: '160px',
    margin: '10px',
    border: '4px solid #EEEEEE',
    borderRadius: '5px'
  }

  return (
    <>
      {images.map((imgSrc, index) => {
        const trigger = ({onOpen}) => (
          <div  style={style} className={`t-image-viewer__ui-image`}>
            <img
              alt={'test'}
              src={ imgSrc?.mainImage || imgSrc }
              className={`t-image-viewer__ui-image--img`}
            />
            <div className={`t-image-viewer__ui-image--hover`} onClick={onOpen}>
              <span><Icon size="1.4em" name={'browse'}/> 预览</span>
            </div>
          </div>
        )

        return (
          <ImageViewer
            key={imgSrc}
            trigger={trigger}
            images={images}
            index={index}
            onIndexChange={console.log}
          />
        )
      })}
    </>
  );
}
