import React from 'react';
import {ImageViewer, Button} from 'tdesign-react';

const img = 'https://tdesign.gtimg.com/demo/demo-image-1.png';

export default function BasicImageViewer() {
  const trigger = ({onOpen}) => <Button onClick={onOpen}>预览单张图片</Button>
  return (
    <ImageViewer trigger={trigger} images={[img]}/>
  );
}
