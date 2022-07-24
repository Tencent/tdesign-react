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

  const UIImageStyle = {width: '160px', height: '160px', marginRight: '50px', border: '4px solid #EEEEEE', borderRadius: '5px'}

  return (
    <>
      <div style={UIImageStyle} className="t-image-viewer__ui-image">
        <ImageViewer trigger={trigger} images={images}/>
      </div>
      <div style={UIImageStyle} className="t-image-viewer__ui-image">
        <ImageViewer trigger={trigger} images={[images[0].mainImage]}/>
      </div>
    </>
  );
}
