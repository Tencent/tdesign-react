import React from 'react';
import {Image, ImageViewer, Space} from 'tdesign-react';
import {BrowseIcon} from 'tdesign-icons-react';

const imgH = 'https://tdesign.gtimg.com/demo/demo-image-3.png';
const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const images = [
    img,
    {
      mainImage: imgH,
      download: true,
      thumbnail: imgH
    },
    imgV
  ]

  return (
    <Space breakLine size={16}>
      {images.map((imgSrc, index) => {
        const trigger = ({open}) => {
          const mask = (
            <div
              style={{
                background: 'rgba(0,0,0,.6)',
                color: '#fff',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={open}
            >
              <span><BrowseIcon size="16px" name={'browse'}/> 预览</span>
            </div>
          );

          return (
            <Image
              alt={'test'}
              src={typeof imgSrc === 'string' ? imgSrc : imgSrc.mainImage}
              overlayContent={mask}
              overlayTrigger="hover"
              fit="contain"
              style={{
                width: 160,
                height: 160,
                border: '4px solid var(--td-bg-color-secondarycontainer)',
                borderRadius: 'var(--td-radius-medium)',
                backgroundColor: '#fff'
              }}
            />
          )
        }

        return <ImageViewer key={index} trigger={trigger} images={images} defaultIndex={index}/>
      })}
    </Space>
  );
}
