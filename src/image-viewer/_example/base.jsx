import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
  return (
    <div style={{width: '100px', height: '100px'}}>
      <ImageViewer previewSrcList={['https://tdesign.gtimg.com/starter/starter.png']} src={'https://tdesign.gtimg.com/starter/starter.png'}/>
    </div>
  );
}
