import React, { useCallback, useState } from 'react';
import { Radio, Upload, Space } from 'tdesign-react';

const RequestMethod = () => {
  const [files, setFiles] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('requestSuccessMethod');

  // customize upload `file`, if success, return url
  const requestSuccessMethod = useCallback(
    (file) =>
      new Promise((resolve) => {
        // set file.percent for mock upload progress
        // eslint-disable-next-line no-param-reassign
        file.percent = 0;
        let timer = setTimeout(() => {
          // resolve 参数为关键代码
          resolve({
            status: 'success',
            response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' },
          });
          // eslint-disable-next-line no-param-reassign
          file.percent = 100;
          clearTimeout(timer);
          timer = null;
        }, 520);
      }),
    [],
  );

  // customize upload `file`, if fail, return error message
  const requestFailMethod = useCallback(
    () =>
      new Promise((resolve) => {
        // resolve 参数为关键代码
        resolve({
          status: 'fail',
          error: 'for some reason, upload fail',
        });
      }),
    [],
  );

  const onChangeUploadMethod = useCallback((value) => {
    setUploadMethod(value);
    setFiles([]);
  }, []);

  return (
    <Space direction="vertical" size="large">
      <Radio.Group variant="default-filled" value={uploadMethod} onChange={onChangeUploadMethod}>
        <Radio.Button value="requestSuccessMethod">上传成功示例</Radio.Button>
        <Radio.Button value="requestFailMethod">上传失败示例</Radio.Button>
      </Radio.Group>

      <Upload
        files={files}
        onChange={setFiles}
        requestMethod={uploadMethod === 'requestSuccessMethod' ? requestSuccessMethod : requestFailMethod}
        tips="自定义上传方法需要返回成功或失败信息"
      />
    </Space>
  );
};

export default RequestMethod;
