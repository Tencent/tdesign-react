import React from 'react';
import { ImageViewer, Button } from 'tdesign-react';

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => <Button onClick={onOpen}>预览单张图片</Button>
  return (
    <ImageViewer trigger={trigger} images={['https://tdesign.gtimg.com/starter/starter.png']} />
  );
}
