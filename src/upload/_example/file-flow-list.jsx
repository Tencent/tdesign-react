import React, { useState } from 'react';
import { Upload, MessagePlugin, Space, Checkbox } from 'tdesign-react';

export default function FileFlowList() {
  const [uploadInOneRequest, setUploadInOneRequest] = useState(false);
  const [autoUpload, setAutoUpload] = useState(false);
  const [isBatchUpload, setIsBatchUpload] = useState(false);
  const [allowUploadDuplicateFile, setAllowUploadDuplicateFile] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fileList, setFileList] = useState([]);

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  const onValidate = (params) => {
    const { files, type } = params;
    console.log('onValidate', params);
    if (type === 'FILE_OVER_SIZE_LIMIT') {
      files.map((t) => t.name).join('、');
      MessagePlugin.warning(`${files.map((t) => t.name).join('、')} 等文件大小超出限制，已自动过滤`, 5000);
    } else if (type === 'FILES_OVER_LENGTH_LIMIT') {
      MessagePlugin.warning('文件数量超出限制，仅上传未超出数量的文件');
    } else if (type === 'FILTER_FILE_SAME_NAME') {
      // 如果希望支持上传同名文件，请设置 allowUploadDuplicateFile={true}
      MessagePlugin.warning('不允许上传同名文件');
    }
  };

  return (
    <Space direction="vertical">
      <Space>
        <Checkbox checked={disabled} onChange={setDisabled}>禁用状态</Checkbox>
        <Checkbox checked={autoUpload} onChange={setAutoUpload}>自动上传</Checkbox>
        <Checkbox checked={allowUploadDuplicateFile} onChange={setAllowUploadDuplicateFile}>
          允许上传同名文件
        </Checkbox>
        <Checkbox checked={isBatchUpload} onChange={setIsBatchUpload}>
          整体替换上传
        </Checkbox>
        <Checkbox checked={uploadInOneRequest} onChange={setUploadInOneRequest}>
          多个文件一个请求上传
        </Checkbox>
      </Space>

      <br />

      <Upload
        files={fileList}
        onChange={setFileList}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        placeholder="支持批量上传文件，文件格式不限，最多只能上传 10 份文件"
        theme="file-flow"
        multiple
        max={10}
        disabled={disabled}
        autoUpload={autoUpload}
        uploadAllFilesInOneRequest={uploadInOneRequest}
        isBatchUpload={isBatchUpload}
        allowUploadDuplicateFile={allowUploadDuplicateFile}
        onValidate={onValidate}
      />
    </Space>
  );
}
