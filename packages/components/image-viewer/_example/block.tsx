import React from 'react';
import { BrowseIcon } from 'tdesign-icons-react';
import { Image, ImageViewer, Space } from 'tdesign-react';

import type { ImageViewerProps } from 'tdesign-react';

const imgV = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const trigger: ImageViewerProps['trigger'] = ({ open }) => {
    const mask = (
      <div
        style={{
          background: 'rgba(0,0,0,.6)',
          color: '#fff',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={open}
      >
        <span>
          <BrowseIcon size="16px" name={'browse'} /> 预览
        </span>
      </div>
    );

    return (
      <Image
        alt={'test'}
        src={img}
        overlayContent={mask}
        overlayTrigger="hover"
        fit="contain"
        style={{
          width: 160,
          height: 160,
          border: '4px solid var(--td-bg-color-secondarycontainer)',
          borderRadius: 'var(--td-radius-medium)',
          backgroundColor: '#fff',
        }}
      />
    );
  };

  const images = [
    {
      mainImage: imgV,
      thumbnail: img,
    },
  ];

  return (
    <Space breakLine size={16}>
      <ImageViewer trigger={trigger} images={images} zIndex={10000} />
      <ImageViewer trigger={trigger} images={[images[0].mainImage]} zIndex={10000} />
    </Space>
  );
}
