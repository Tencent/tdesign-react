import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => (
    <div className={`t-image-viewer-ui-image`}>
      <img
        alt={'test'}
        src={'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'}
        onClick={onOpen}
        className={`t-image-viewer-ui-image-img`}
      />
    </div>
  )

  const images = [{
    mainImage: 'https://tdesign.gtimg.com/starter/starter11.png',
    thumbnail: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'
  }]

  return (
    <>
      <div style={{width: '100px', height: '100px', marginRight: '50px'}} className="t-image-viewer-ui-image">
        <ImageViewer trigger={trigger} images={images}/>
      </div>
      <div style={{width: '100px', height: '100px'}} className="t-image-viewer-ui-image">
        <ImageViewer trigger={trigger} images={[images[0].mainImage]}/>
      </div>
    </>
  );
}
