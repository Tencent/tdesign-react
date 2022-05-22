import React from 'react';
import { ImageViewer, Button } from 'tdesign-react';

export default function BasicImageViewer() {
  return (
    <ImageViewer previewSrcList={['https://tdesign.gtimg.com/starter/starter.png']} >
      {({ onOpen }) => <Button onClick={onOpen}>预览单张图片</Button>}
    </ImageViewer>
  );
}
