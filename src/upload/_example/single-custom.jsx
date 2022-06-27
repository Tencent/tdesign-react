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
  }, []);
  const beforeUpload = useCallback(
    (file) =>
      new Promise((resolve, reject) => {
        setName('name2');
        if (file.size > MAX_UPLOAD_SIZE * 1024 * 1024) {
          message.warning(`上传的图片不能大于${MAX_UPLOAD_SIZE}M`);
          reject(new Error(false));
        }
        resolve(true);
      }),
    [],
  );

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
          <ul>
            {files.map((file, index) => (
              <li key={index} style={{ marginTop: '16px' }}>
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Space>
  );
}
