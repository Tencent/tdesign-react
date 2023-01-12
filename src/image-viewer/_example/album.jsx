import React from 'react';
import {Image, ImageViewer, Space} from 'tdesign-react';
import {BrowseIcon} from 'tdesign-icons-react';

const imgH = 'https://tdesign.gtimg.com/demo/demo-image-3.png';
const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
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
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'content-box',
        border: '4px solid var(--td-bg-color-secondarycontainer)',
        borderRadius: 'var(--td-radius-medium)',
      }}>
        <Image
          alt={'test'}
          src={img}
          overlayContent={mask}
          overlayTrigger="hover"
          fit="contain"
          style={{
            width: 240,
            height: 240,
            backgroundColor: '#fff'
          }}
        />
        <div style={{
          width: '100%',
          height: '56px',
          padding: '0 16px',
          lineHeight: '56px',
          position: 'absolute',
          bottom: '0',
          color: 'var(--td-text-color-anti)',
          backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, .4) 0%, rgba(0, 0, 0, 0) 100%)',
          boxSizing: 'border-box',
          zIndex: 1
        }}>
          <span>相册封面标题</span>
        </div>
      </div>

    )
  }

  const images = [
    img,
    imgV,
    imgH
  ]

  return (
    <Space breakLine size={16}>
      <ImageViewer trigger={trigger} images={images} title="相册封面标题"/>
    </Space>
  );
}
