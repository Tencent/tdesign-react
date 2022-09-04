import React, { useState } from 'react';
import { Upload, MessagePlugin } from 'tdesign-react';

const UploadSingleInput = () => {
  const [files, setFiles] = useState([]);

  const handleFail = ({ file }) => {
    MessagePlugin.error(`${file.name} 上传失败`);
  };

  const onSuccess = () => {
    MessagePlugin.success('上传成功');
  };

  return (
    <div style={{ width: '350px' }}>
      <Upload
        value={files}
        onChange={setFiles}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="file-input"
        placeholder="请选择文件"
        onFail={handleFail}
        onSuccess={onSuccess}
      ></Upload>
    </div>
  )
};

UploadSingleInput.displayName = 'UploadSingleInput';

export default UploadSingleInput;
