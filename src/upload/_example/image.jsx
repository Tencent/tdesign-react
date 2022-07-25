import React from 'react';
import { Upload, Space } from 'tdesign-react';

export default function UploadExample() {
  return (
    <Space direction="vertical">
      <Upload
        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="image"
        tips="请选择单张图片文件上传"
        accept="image/*"
        locale={{
          triggerUploadText: {
            image: '请选择图片',
          },
        }}
      />
      <Upload
        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="image"
        tips="默认已上传文件"
        accept="image/*"
        defaultFiles={[
          {
            url: 'http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg',
            name: 'default.jpeg',
            status: 'success',
          },
        ]}
      />
      <Upload
        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="image"
        tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
        accept="image/*"
        multiple
        max={3}
      />
    </Space>
  );
}
