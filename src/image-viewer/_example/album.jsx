import React from 'react';
import { ImageViewer } from 'tdesign-react';
import {Icon} from 'tdesign-icons-react';
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';
import './style.less'

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => (
    <div className={`t-image-viewer__ui-image`}>
      <img
        alt={'test'}
        src={img}
        className={`t-image-viewer__ui-image--img`}
      />
      <div className={`t-image-viewer__ui-image--hover`} onClick={onOpen}>
        <span><Icon size="1.4em" name={'browse'}/> 预览</span>
      </div>
      <div className={`t-image-viewer__ui-image--footer`}>
        <span className={`t-image-viewer__ui-image--title`}>相册封面标题</span>
      </div>
    </div>
  )

  const images = [
    img,
    imgV,
    imgH,
  ]

  const style = {width: '240px', height: '240px', border: '4px solid #EEEEEE'}

  return (
    <div style={style}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
