import React from 'react';
import { Upload, Radio, Switch } from 'tdesign-react';

export default function UploadExample() {
  const [autoUpload, setAutoUpload] = React.useState(false);
  const [theme, setTheme] = React.useState('file');

  return (
    <>
      <div>
        <div>
          是否自动上传：
          <Switch value={autoUpload} onChange={(val) => setAutoUpload(val)} />
          <br />
        </div>
        <Radio.Group defaultValue="file" onChange={(val) => setTheme(val)}>
          <Radio value="file">文件拖拽上传</Radio>
          <Radio value="image">图片拖拽上传</Radio>
        </Radio.Group>
        <br />
        <br />
        <Upload
          theme={theme}
          autoUpload={autoUpload}
          data={{ extraData: 123, fileName: 'certificate' }}
          draggable
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        />
      </div>
    </>
  );
}
