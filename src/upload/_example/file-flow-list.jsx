import React from 'react';
import { Upload } from 'tdesign-react';

export default function FileFlowList() {
  return (
    <Upload
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      placeholder="支持批量上传文件，文件格式不限，最多只能上传 10 份文件"
      theme="file-flow"
      multiple
      autoUpload={false}
      max={10}
    />
  );
}
