import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
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
      </div>
    </div>
  )

  const images = [
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'
  ]

  return (
    <div style={{width: '150px', height: '100px'}}>
      <ImageViewer trigger={trigger} images={images} />
    </div>
  );
}
