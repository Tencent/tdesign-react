import React, { useState } from 'react';
import { Upload, Space, MessagePlugin, Switch } from 'tdesign-react';

export default function TUploadImageFlow() {
  const [autoUpload, setAutoUpload] = useState(false);
  const [files3, setFiles3] = useState([]);

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

  // 因接口返回的 url 是同一个，所以看到的图片都是一个
  return (
    <Space direction="vertical">
      <div>
        是否自动上传：
        <Switch value={autoUpload} onChange={setAutoUpload} />
      </div>

      <br />

      <Upload
        files={files3}
        onChange={setFiles3}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        placeholder="支持批量上传图片文件"
        theme="image-flow"
        accept="image/*"
        multiple
        autoUpload={autoUpload}
        max={8}
        onValidate={onValidate}
      />
    </Space>
  );
}
