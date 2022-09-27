import React, { useCallback, useState } from 'react';
import { Button, message, Upload, Space } from 'tdesign-react';

export default function SingleCustom() {
  const MAX_UPLOAD_SIZE = 1;
  const [tips, setTips] = useState(`上传文件大小在 ${MAX_UPLOAD_SIZE}M 以内`);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('name');

  const handleChange = useCallback((files) => {
    setFiles(files);
  }, []);
  const handleFail = useCallback(({ file }) => {
    message.error(`文件 ${file.name} 上传失败`);
  }, []);
  const handleSuccess = useCallback(() => {
    setTips('');
    message.success('上传成功');
  }, []);
  const beforeUpload = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        setName('name2');
        // 在这里写文件上传前的校验
        resolve(true);
      }),
    [],
  );

  // 也可以使用 useUpload 自定义上传组件，该 Hook 包含上传组件的所有的逻辑
  return (
    <Space direction="vertical">
      <Upload
        headers={{
          name,
        }}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        tips={tips}
        files={files}
        onChange={handleChange}
        onFail={handleFail}
        onSuccess={handleSuccess}
        theme="custom"
        beforeUpload={beforeUpload}
        method="put"
        multiple
      >
        <Button theme="primary">自定义上传</Button>
      </Upload>
      {files?.length > 0 && (
        <div style={{ fontSize: '13px' }}>
          <ul style={{ padding: 0 }}>
            {files.map((file, index) => (
              <li key={index} style={{ listStyleType: 'none' }}>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Space>
  );
}
