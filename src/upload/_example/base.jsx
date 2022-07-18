import React from 'react';
import { Upload } from 'tdesign-react';

export default function UploadExample() {
  const handleFail = ({ file }) => {
    console.error(`文件 ${file.name} 上传失败`);
  };
  // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
  const formatResponse = (res) => ({ ...res, error: '上传失败，请重试', url: res.url });

  return (
    <Upload
      onFail={handleFail}
      format-response={formatResponse}
      tips="上传文件大小在 5M 以内"
      action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
    />
  );
}
