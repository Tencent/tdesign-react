import React from 'react';
import { ImageViewer } from 'tdesign-react';

export default function BasicImageViewer() {
  const previewSrcList = [
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/button-1@2x.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Grid_1.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/20211221143256.png',
    'https://oteam-tdesign-1258344706.cos.ap-guangzhou.myqcloud.com/site/design/Avatar_3.png'
  ]

  return (
    <div style={{width: '150px', height: '100px'}}>
      <ImageViewer title={'相册封面标题'} titleIcons={['browse','ellipsis']} previewSrcList={previewSrcList} src={'https://tdesign.gtimg.com/starter/starter.png'}/>
    </div>
  );
}
