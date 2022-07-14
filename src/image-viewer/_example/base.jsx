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
    </div>
  )

  return (
    <div style={{width: '100px', height: '100px'}}>
      <ImageViewer draggable mode="modeless" trigger={trigger} images={['https://tdesign.gtimg.com/starter/starter.png']}/>
    </div>
  );
}
