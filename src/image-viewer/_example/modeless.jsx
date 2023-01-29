import React from 'react';
import {ImageViewer, Image, Space} from 'tdesign-react';
import {BrowseIcon} from 'tdesign-icons-react'

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
          backgroundColor: '#fff'
        }}
      />
    )
  }

  return (
    <Space breakLine size={16}>
      <ImageViewer draggable mode="modeless" title="预览单张图片" trigger={trigger} images={[img]}/>
    </Space>
  );
}
