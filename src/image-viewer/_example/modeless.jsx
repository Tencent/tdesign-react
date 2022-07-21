import React from 'react';
import { ImageViewer } from 'tdesign-react';
import {Icon} from 'tdesign-icons-react';
import img from '../img/img.png';
import './style.less';

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
    </div>
  )

  const style = {width: '160px', height: '160px', border: '4px solid #EEEEEE', borderRadius: '5px'}

  return (
    <div style={style}>
      <ImageViewer draggable mode="modeless" trigger={trigger} images={[img]}/>
    </div>
  );
}
