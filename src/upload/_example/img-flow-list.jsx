import React from 'react';
import { Upload } from 'tdesign-react';

export default function TUploadImageFlow() {
  return (
    <Upload
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      placeholder="支持批量上传图片文件"
      theme="image-flow"
      accept="image/*"
      multiple
      autoUpload={false}
      max={8}
    />
  );
}
