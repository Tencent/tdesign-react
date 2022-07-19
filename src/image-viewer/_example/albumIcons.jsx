import React from 'react';
import { ImageViewer, Popup } from 'tdesign-react';
import {IconFont} from "tdesign-icons-react";
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';

const ImageViewerIconList = ({ list, onClick }) => (
  <ul className={`t-select__list`}>
    {list.map((it, index) => (
      <li key={index} className={`t-select-option`} onClick={() => onClick(it, index)}>
        <span>{it.label}</span>
      </li>
    ))}
  </ul>
);
export default function BasicImageViewer() {
  const images = [
    img,
    imgH,
    imgV
  ]

  const trigger = ({ onOpen }) => {
    const listCommon = (
      <ImageViewerIconList
        onClick={onOpen}
        list={images.map((i, index) => ({ label: `图片${index}` }))}
      />
    );

    return (
      <div className={`t-image-viewer-ui-image`}>
        <img
          alt={'test'}
          src={img}
          className={`t-image-viewer-ui-image-img`}
        />
        <div className={`t-image-viewer-ui-image-footer`}>
          <span className={`t-image-viewer-ui-image-title`}>相册封面标题</span>
          <span className={`t-image-viewer-ui-image-icons`}>
          <IconFont name="browse" onClick={onOpen} />
          <Popup
            trigger="click"
            content={listCommon}
            placement="right-bottom"
            overlayStyle={{ width: '140px' }}
            destroyOnClose
          >
            <IconFont name="ellipsis" />
          </Popup>
          </span>
        </div>
      </div>
    )
  }

  const style = {width: '160px', height: '160px'}

  return (
    <div style={style}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
