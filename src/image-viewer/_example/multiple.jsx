import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
  const previewSrcList = [
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'
  ]

  const style = {
    height: '100px',
    width: '100px'
  }

  return (
    <>
      {previewSrcList.map((imgSrc, index) => (
        <ImageViewer key={imgSrc} style={style} previewSrcList={previewSrcList} src={imgSrc} startIndex={index}/>
      ))}
    </>
  );
}
