import React from 'react';
import { ImageViewer, Popup } from 'tdesign-react';
import {BrowseIcon, EllipsisIcon} from 'tdesign-icons-react';
import imgH from '../img/imgH.png';
import img from '../img/img.png';
import imgV from '../img/imgV.png';
import './style.less'

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
      <div className={`t-image-viewer__ui-image`}>
        <img
          alt={'test'}
          src={img}
          className={`t-image-viewer__ui-image--img`}
        />
        <div className={`t-image-viewer__ui-image--footer`}>
          <span className={`t-image-viewer__ui-image--title`}>相册封面标题</span>
          <span className={`t-image-viewer__ui-image--icons`}>
          <BrowseIcon onClick={onOpen} />
          <Popup
            trigger="click"
            content={listCommon}
            placement="right-bottom"
            overlayStyle={{ width: '140px', padding: '6px' }}
            destroyOnClose
          >
            <EllipsisIcon classname="t-image-viewer__ui-image--ellipsis" />
          </Popup>
          </span>
        </div>
      </div>
    )
  }

  const style = {width: '240px', height: '240px' }

  return (
    <div style={style} className={`t-image-viewer__base`}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
