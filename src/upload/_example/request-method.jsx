import React, { useCallback, useRef, useState } from 'react';
import { Radio, Upload, Space, MessagePlugin } from 'tdesign-react';

const RequestMethod = () => {
  const [files, setFiles] = useState([]);
  const [uploadMethod, setUploadMethod] = useState('requestSuccessMethod');
  const uploadRef = useRef(null);

  // customize upload `file`, if success, return url
  const requestSuccessMethod = useCallback(
    (file) =>
      new Promise((resolve) => {
        // 上传进度控制示例
        let percent = 0;
        const percentTimer = setInterval(() => {
          if (percent + 10 < 99) {
            percent += 10;
            uploadRef.current.uploadFilePercent({ file, percent });
          } else {
            clearInterval(percentTimer);
          }
        }, 100);

        //  mock upload progress
        let timer = setTimeout(() => {
          // resolve 参数为关键代码
          resolve({
            status: 'success',
            response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' },
          });
          clearTimeout(timer);
          timer = null;
        }, 1000);
      }),
    [],
  );

  // customize upload `file`, if fail, return error message
  const requestFailMethod = useCallback(
    () =>
      new Promise((resolve) => {
        const errorResult = {
          status: 'fail',

          // `errorResult.error` is equal to `errorResult.response.error`
          // error: 'for some reason, upload fail',

          // this is request response, response.url is required for file or image preview
          response: { url: '', error: 'for some reason, upload fail' },
        };
        resolve(errorResult);
      }),
    [],
  );

  const onChangeUploadMethod = useCallback((value) => {
    setUploadMethod(value);
    setFiles([]);
  }, []);

  const onSuccess = () => {
    MessagePlugin.success('上传成功');
  };

  const onFail = () => {
    MessagePlugin.error('上传失败');
  };

  return (
    <Space direction="vertical" size="large">
      <Radio.Group variant="default-filled" value={uploadMethod} onChange={onChangeUploadMethod}>
        <Radio.Button value="requestSuccessMethod">上传成功示例</Radio.Button>
        <Radio.Button value="requestFailMethod">上传失败示例</Radio.Button>
      </Radio.Group>

      <Upload
        ref={uploadRef}
        files={files}
        onChange={setFiles}
        requestMethod={uploadMethod === 'requestSuccessMethod' ? requestSuccessMethod : requestFailMethod}
        placeholder="自定义上传方法需要返回成功或失败信息"
        onSuccess={onSuccess}
        onFail={onFail}
      />
    </Space>
  );
};

export default RequestMethod;
