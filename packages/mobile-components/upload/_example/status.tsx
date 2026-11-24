import React from 'react';
import type { UploadFile } from 'tdesign-mobile-react';
import { Upload } from 'tdesign-mobile-react';

export default function StatusDemo() {
  const files: UploadFile[] = [
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload6.png',
      name: 'uploaded1.png',
      type: 'image',
      status: 'progress',
    },
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded1.png',
      type: 'image',
      status: 'progress',
      percent: 68,
    },
  ];
  const failFiles: UploadFile[] = [
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded1.png',
      type: 'image',
      status: 'fail',
    },
  ];
  return (
    <>
      <div className="upload-demo">
        <div className="upload-title">上传图片</div>
        <Upload
          defaultFiles={files}
          accept="image/png"
          multiple
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        />
      </div>
      <div className="upload-demo__title">上传失败</div>
      <div className="upload-demo">
        <div className="upload-title">上传图片</div>
        <Upload
          defaultFiles={failFiles}
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          multiple
        />
      </div>
    </>
  );
}
