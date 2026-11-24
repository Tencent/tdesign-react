// @ts-ignore
import type { MouseEvent } from 'react';
import React, { useState } from 'react';
import {
  ProgressContext,
  SuccessContext,
  Upload,
  UploadChangeContext,
  UploadFailContext,
  UploadFile,
  UploadRemoveContext,
} from 'tdesign-mobile-react';

export default () => {
  const [files, setFiles] = useState<UploadFile[]>([
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded1.png',
      type: 'image',
    },
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload6.png',
      name: 'uploaded2.png',
      type: 'image',
    },
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded3.png',
      type: 'image',
    },
  ]);
  const onFail = ({ file, e }: UploadFailContext): any => {
    console.log('---onFail', file, e);
    return null;
  };
  const onProgress = ({ file, percent, type, e }: ProgressContext) => {
    console.log('---onProgress:', file, percent, type, e);
  };
  const onChange = (files: Array<UploadFile>, { e, response, trigger, index, file }: UploadChangeContext) => {
    console.log('====onChange', files, e, response, trigger, index, file);
    setFiles(files);
  };
  const onPreview = ({ file, e }: { file: UploadFile; e: MouseEvent }) => {
    console.log('====onPreview', file, e);
  };
  const onSuccess = ({ file, fileList, response, e }: SuccessContext) => {
    console.log('====onSuccess', file, fileList, e, response);
  };
  const onRemove = ({ index, file, e }: UploadRemoveContext) => {
    console.log('====onRemove', index, file, e);
  };
  const onSelectChange = (files: Array<UploadFile>) => {
    console.log('====onSelectChange', files);
  };
  const onClickUpload = ({ e }: { e: MouseEvent }) => {
    console.log('====onClickUpload', e);
  };
  return (
    <div className="upload-demo">
      <div className="upload-title">多选上传</div>
      <Upload
        multiple
        draggable
        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        defaultFiles={files}
        max={10}
        onFail={onFail}
        onProgress={onProgress}
        onChange={onChange}
        onPreview={onPreview}
        onSuccess={onSuccess}
        onRemove={onRemove}
        onSelectChange={onSelectChange}
        onClickUpload={onClickUpload}
      />
    </div>
  );
};
