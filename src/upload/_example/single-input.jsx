import React, { useState, useRef } from 'react';
import { Upload, MessagePlugin, Space, Button, Checkbox } from 'tdesign-react';

const UploadSingleInput = () => {
  const uploadRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [autoUpload, setAutoUpload] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const handleFail = ({ file }) => {
    MessagePlugin.error(`${file.name} 上传失败`);
  };

  const onSuccess = () => {
    MessagePlugin.success('上传成功');
  };

  // 非自动上传文件，需要在父组件单独执行上传
  const uploadFiles = () => {
    uploadRef.current.uploadFiles();
  };

  return (
    <Space direction='vertical'>
      <Space>
        <Checkbox checked={autoUpload} onChange={setAutoUpload}>
          自动上传
        </Checkbox>
        <Checkbox checked={disabled} onChange={setDisabled}>
          禁用状态
        </Checkbox>
        {!autoUpload && (
          <Button variant="base" theme="default" size="small" style={{ height: '22px' }} onClick={uploadFiles}>
            点击上传
          </Button>
        )}
      </Space>
      <br />
      <Upload
        ref={uploadRef}
        style={{ width: '350px' }}
        files={files}
        onChange={setFiles}
        abridgeName={[8, 6]}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="file-input"
        placeholder="请选择文件"
        autoUpload={autoUpload}
        disabled={disabled}
        onFail={handleFail}
        onSuccess={onSuccess}
      ></Upload>
    </Space>
  )
};

UploadSingleInput.displayName = 'UploadSingleInput';

export default UploadSingleInput;
