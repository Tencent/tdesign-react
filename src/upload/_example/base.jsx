import React, { useRef, useState, useEffect } from 'react';
import { Upload, Space, Radio, Checkbox, Button, MessagePlugin } from 'tdesign-react';
import { CloseIcon } from 'tdesign-icons-react';

export default function UploadExample() {
  const uploadRef1 = useRef(null);
  const uploadRef2 = useRef(null);
  const uploadRef3 = useRef(null);
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([
    {
      name: '这是一个默认文件',
      status: 'success',
      url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
      size: 1000,
    },
  ]);
  const [files3, setFiles3] = useState([]);
  const [multiple, setMultiple] = useState(false);
  const [uploadInOneRequest, setUploadInOneRequest] = useState(false);
  const [autoUpload, setAutoUpload] = useState(true);
  const [isBatchUpload, setIsBatchUpload] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setFiles3(multiple ? [
      {
        name: '这是一个上传成功的文件',
        status: 'success',
        url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
        size: 1000,
      },
      {
        name: '这是一个上传中的文件',
        status: 'progress',
        percent: 30,
        url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
        size: 1000,
      },
      {
        name: '这是一个上传失败的文件',
        status: 'fail',
        url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
        size: 1000,
      },
      {
        name: '这是一个等待上传的文件',
        status: 'waiting',
        url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
        size: 1000,
      },
    ] : [])
  }, [multiple]);

  const handleFail = ({ file }) => {
    MessagePlugin.error(`文件 ${file.name} 上传失败`);
  };

  const handleSelectChange = (files) => {
    console.log('onSelectChange', files);
  };

  const handleSuccess = (params) => {
    console.log(params);
    MessagePlugin.success('上传成功');
  };

  // 多文件上传，一个文件一个请求场景，每个文件也会单独触发上传成功的事件
  const onOneFileSuccess = (params) => {
    console.log('onOneFileSuccess', params);
  };

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

  // 仅自定义文件列表所需
  // eslint-disable-next-line
  const outsideRemove = (index) => {
    const tmpFiles = [...files3];
    tmpFiles.splice(index, 1);
    setFiles3(tmpFiles);
  };

  // eslint-disable-next-line
  const fileListDisplay = () => (
    <div>
      {files3.map((file, index) => (
        <div key={file.name} className="t-upload__single-display-text t-upload__display-text--margin">
          {file.name}（{file.size} B）
          <CloseIcon className="t-upload__icon-delete" onClick={() => outsideRemove(index)} />
        </div>
      ))}
    </div>
  );

  // 非自动上传文件，需要在父组件单独执行上传请求
  const uploadFiles = () => {
    uploadRef1.current.uploadFiles();
    uploadRef2.current.uploadFiles();
    uploadRef3.current.uploadFiles();
  };

  // 非自动上传文件，需保存待上传文件列表
  const [waitingUploadFiles, setWaitingUploadFiles] = useState([]);
  const onWaitingUploadFilesChange = (files) => {
    setWaitingUploadFiles(files);
    console.log('onWaitingUploadFilesChange', waitingUploadFiles, files);
  };

  // 用于格式化接口响应值，error 会被用于上传失败的提示文字；url 表示文件/图片地址
  const formatResponse = (res) => ({ ...res, error: '上传失败，请重试', url: res?.url });

  /** 单个文件校验方法，示例代码有效，勿删 */
  // const beforeUpload = (file) => {
  //   MessagePlugin.error(`文件 ${file.name} 不满足条件`);
  //   return false;
  // };

  /** 全部文件一次性校验方法，示例代码有效，勿删 */
  // const beforeAllFilesUpload = () => {
  //   MessagePlugin.error(`文件不满足条件`);
  //   return false;
  // };

  return (
    <Space direction="vertical">
      <Space>
        <Radio.Group value={multiple} onChange={setMultiple} variant="default-filled">
          <Radio.Button value={false}>单文件上传</Radio.Button>
          <Radio.Button value={true}>多文件上传</Radio.Button>
        </Radio.Group>
      </Space>
      <Space>
        <Checkbox checked={disabled} onChange={setDisabled}>
          禁用状态
        </Checkbox>
        {multiple && (
          <Checkbox checked={uploadInOneRequest} onChange={setUploadInOneRequest}>
            多个文件一个请求上传
          </Checkbox>
        )}
        {multiple && (
          <Checkbox checked={isBatchUpload} onChange={setIsBatchUpload}>
            整体替换上传
          </Checkbox>
        )}
        <Checkbox checked={autoUpload} onChange={setAutoUpload}>
          自动上传
        </Checkbox>
        {!autoUpload && (
          <Button variant="base" theme="default" style={{ height: '22px' }} onClick={uploadFiles}>
            点击手动上传
          </Button>
        )}
      </Space>

      <br />

      {/* <!-- 1. formatRequest 用于修改或新增上传请求数据，示例：:formatRequest="(obj) => ({ ...obj, other: 123 })" --> */}
      <Space>
        <Upload
          ref={uploadRef1}
          files={files1}
          onChange={(val) => {
            console.log(val);
            setFiles1(val);
          }}
          action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          placeholder={multiple ? '文件数量不超过 5 个' : '要求文件大小在 1M 以内'}
          multiple={multiple}
          autoUpload={autoUpload}
          uploadAllFilesInOneRequest={uploadInOneRequest}
          isBatchUpload={isBatchUpload}
          sizeLimit={{ size: 1, unit: 'MB' }}
          max={5}
          disabled={disabled}
          allowUploadDuplicateFile={true}
          // formatRequest={(obj) => ({ ...obj, other: 123 })}
          onSelectChange={handleSelectChange}
          onFail={handleFail}
          onSuccess={handleSuccess}
          onOneFileSuccess={onOneFileSuccess}
          onValidate={onValidate}
          onWaitingUploadFilesChange={onWaitingUploadFilesChange}
        />

        <Upload
          ref={uploadRef2}
          files={files2}
          onChange={setFiles2}
          multiple={multiple}
          disabled={disabled}
          autoUpload={autoUpload}
          uploadAllFilesInOneRequest={uploadInOneRequest}
          isBatchUpload={isBatchUpload}
          triggerButtonProps={{ theme: 'primary', variant: 'base' }}
          placeholder="这是一段没有文件时的占位文本"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          style={{ marginLeft: '40px' }}
          onFail={handleFail}
        ></Upload>

        {/* formatResponse 可控制上传成功或者失败 */}
        <Upload
          ref={uploadRef3}
          files={files3}
          onChange={setFiles3}
          multiple={multiple}
          disabled={disabled}
          autoUpload={autoUpload}
          uploadAllFilesInOneRequest={uploadInOneRequest}
          isBatchUpload={isBatchUpload}
          formatResponse={formatResponse}
          placeholder="文件上传失败示例"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          style={{ marginLeft: '60px' }}
          // fileListDisplay={fileListDisplay}
          onFail={handleFail}
        />
      </Space>
    </Space>
  );
}
