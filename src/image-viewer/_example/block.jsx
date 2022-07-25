import React from 'react';
import { ImageViewer } from 'tdesign-react';
import {BrowseIcon} from "tdesign-icons-react";
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
        <span><BrowseIcon size="1.4em" name={'browse'}/> 预览</span>
      </div>
    </div>
  )

  const images = [{
    mainImage: imgV,
    thumbnail: img
  }]

  return (
    <>
      <div className="t-image-viewer__ui-image t-image-viewer__base">
        <ImageViewer trigger={trigger} images={images}/>
      </div>
      <div className="t-image-viewer__ui-image t-image-viewer__base">
        <ImageViewer trigger={trigger} images={[images[0].mainImage]}/>
      </div>
    </>
  );
}
