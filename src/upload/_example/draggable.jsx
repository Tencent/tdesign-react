import React, { useState } from 'react';
import { Upload, Radio, Switch, Space, MessagePlugin } from 'tdesign-react';

export default function UploadExample() {
  const [files, setFiles] = useState([]);
  const [files2, setFiles2] = useState([{ name: '默认文件', url: 'https://tdesign.gtimg.com/site/source/figma-pc.png', status: 'success', size: 1024 }]);
  const [autoUpload, setAutoUpload] = React.useState(false);
  const [theme, setTheme] = React.useState('file');

  const onFail = () => {
    MessagePlugin.error('上传失败');
  };

  const onSuccess = () => {
    MessagePlugin.success('上传成功');
  };

  return (
    <Space direction="vertical">
      <div>
        是否自动上传：
        <Switch value={autoUpload} onChange={setAutoUpload} />
      </div>
      <Radio.Group defaultValue="file" onChange={(val) => setTheme(val)} variant="default-filled">
        <Radio.Button value="file">文件拖拽上传</Radio.Button>
        <Radio.Button value="image">图片拖拽上传</Radio.Button>
      </Radio.Group>

      <br />

      <Space>
        {/* 可以使用 trigger 自定义拖拽区域显示的内容 */}
        <Upload
          theme={theme}
          autoUpload={autoUpload}
          data={{ extraData: 123, fileName: 'certificate' }}
          draggable
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          files={files}
          onChange={setFiles}
          onFail={onFail}
          onSuccess={onSuccess}
        />

        <Upload
          theme={theme}
          autoUpload={autoUpload}
          data={{ extraData: 123, fileName: 'certificate' }}
          draggable
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          files={files2}
          onChange={setFiles2}
          onFail={onFail}
          onSuccess={onSuccess}
        />
      </Space>
    </Space>
  );
}
