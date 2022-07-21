import React from 'react';
import { ImageViewer, Button } from 'tdesign-react';
import img from '../img/img.png';

export default function BasicImageViewer() {
  const trigger = ({ onOpen }) => <Button onClick={onOpen}>预览单张图片</Button>
  return (
    <ImageViewer trigger={trigger} images={[img]} />
  );
}
