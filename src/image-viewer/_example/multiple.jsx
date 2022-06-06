import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
  const images = [
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    {
      mainImage: 'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
      download: true,
      thumbnail: 'https://tdesign.gtimg.com/starter/starter.png',
    },
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png',
  ]

  const style = {
    height: '100px',
    width: '100px',
    margin: '10px'
  }

  return (
    <>
      {images.map((imgSrc, index) => {
        const trigger = ({onOpen}) => (
          <div  style={style} className={`t-image-viewer-ui-image`}>
            <img
              alt={'test'}
              src={imgSrc?.mainImage ? imgSrc?.mainImage : imgSrc}
              onClick={onOpen}
              className={`t-image-viewer-ui-image-img`}
            />
          </div>
        )

        return (
          <ImageViewer
            key={imgSrc}
            trigger={trigger}
            images={images}
            defaultIndex={index}
          />
        )
      })}
    </>
  );
}
