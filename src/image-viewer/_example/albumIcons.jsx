import React from 'react';
import { ImageViewer, Popup } from 'tdesign-react';
import {IconFont} from "tdesign-icons-react";

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
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'
  ]

  const listCommon = (
    <ImageViewerIconList
      onClick={(value) => {
        console.log(value);
      }}
      list={images.map((i, index) => ({ label: `图片${index}` }))}
    />
  );

  const trigger = ({ onOpen }) => (
    <div className={`t-image-viewer-ui-image`}>
      <img
        alt={'test'}
        src={'https://tdesign.gtimg.com/starter/starter.png'}
        onClick={onOpen}
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

  return (
    <div style={{width: '150px', height: '100px'}}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
