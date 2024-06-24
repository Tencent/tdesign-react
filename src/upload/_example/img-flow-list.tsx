import React, { useState } from 'react';
import { Upload, Space, MessagePlugin, Switch, Checkbox, Divider, SwitchProps, type UploadProps } from 'tdesign-react';

const ABRIDGE_NAME = [4, 6];

const FILE_EXAMPLE = {
  status: 'success' as const,
  response: {
    url: 'https://tdesign.gtimg.com/site/avatar.jpg',
  },
};

type RequestMethodReturn = Awaited<ReturnType<UploadProps['requestMethod']>>;

export default function TUploadImageFlow() {
  const [autoUpload, setAutoUpload] = useState(false);
  const [showImageFileName, setShowImageFileName] = useState(true);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [files, setFiles] = useState([
    { url: 'https://tdesign.gtimg.com/demo/demo-image-1.png', status: 'success', name: 'demo-image-1.png' },
    { url: 'https://tdesign.gtimg.com/site/avatar.jpg', status: 'success', name: 'avatar.jpg' },
  ]);
  // eslint-disable-next-line
  const [files2, setFiles2] = useState([]);

  const staticFiles = [
    {
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'loading.svg',
      status: 'success',
    },
    {
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'loading.svg',
      status: 'waiting',
    },
    {
      // url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'loading.svg',
      status: 'progress',
      percent: 10,
    },
    {
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'loading.svg',
      status: 'fail',
    },
  ];

  // 示例代码：自定义上传方法，一个请求上传一个文件
  // eslint-disable-next-line
  const requestMethod1 = () => {
    return new Promise<RequestMethodReturn>((resolve) => {
      resolve(FILE_EXAMPLE);
    });
  };

  // 示例代码：自定义上传方法，一个请求上传多个文件
  // eslint-disable-next-line
  const requestMethod2 = () => {
    const files = [
      { name: files2[0].name, status: 'success', url: 'https://tdesign.gtimg.com/site/avatar.jpg' },
      { name: files2[1].name, status: 'success', url: 'https://avatars.githubusercontent.com/u/11605702?v=4' },
    ];
    return new Promise((resolve) => {
      resolve({
        status: 'success',
        response: { files },
      });
    });
  };

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  const onValidate: UploadProps['onValidate'] = (params) => {
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

  const handleSwitchChange: SwitchProps<typeof autoUpload>['onChange'] = (checked) => {
    setAutoUpload(checked);
  };

  // 因接口返回的 url 是同一个，所以看到的图片都是一个
  return (
    <Space direction="vertical">
      <Space>
        <div>
          AutoUpload
          <Switch value={autoUpload} onChange={handleSwitchChange} />
        </div>
        <Checkbox value={showImageFileName} onChange={setShowImageFileName}>
          Show Image Name
        </Checkbox>
        <Checkbox value={showUploadButton} onChange={setShowUploadButton}>
          Show UploadButton Or CancelUploadButton
        </Checkbox>
      </Space>

      <br />

      {/* <!-- action 上传地址，使用组件内部上传逻辑，action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo" --> */}
      {/* <!-- requestMethod 自定义上传方法，自定义上传逻辑 --> */}
      <Upload
        files={files}
        onChange={setFiles}
        // action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        requestMethod={requestMethod1}
        placeholder="支持批量上传图片文件"
        theme="image-flow"
        accept="image/*"
        multiple
        autoUpload={autoUpload}
        max={8}
        abridgeName={ABRIDGE_NAME}
        showImageFileName={showImageFileName}
        uploadButton={showUploadButton ? {} : null}
        cancelUploadButton={showUploadButton ? { theme: 'default', content: '取消上传' } : null}
        onValidate={onValidate}
      />

      {/* <Upload
        files={files2}
        onChange={setFiles2}
        // action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        requestMethod={requestMethod2}
        placeholder="支持批量上传图片文件"
        theme="image-flow"
        accept="image/*"
        multiple
        autoUpload={autoUpload}
        max={8}
        abridgeName={ABRIDGE_NAME}
        uploadAllFilesInOneRequest={true}
        onValidate={onValidate}
      /> */}

      <br />
      <Divider align="left">Different Status Images</Divider>

      <Upload
        files={staticFiles}
        theme="image-flow"
        showImageFileName={showImageFileName}
        className="static-image-list"
      ></Upload>
    </Space>
  );
}
