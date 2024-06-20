import React from 'react';
import { ImageViewer, Image } from 'tdesign-react';
import { BrowseIcon } from 'tdesign-icons-react';

const img = [
  {
    mainImage: 'https://tdesign.gtimg.com/demo/tdesign-logo.svg',
    isSvg: true,
  },
  {
    mainImage: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
  },
];

const Svg = () => {
  const trigger = ({ open }) => {
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
        src={img[0].mainImage}
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
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div>
        <ImageViewer trigger={trigger} images={img} />
      </div>
    </div>
  );
};

export default Svg;
