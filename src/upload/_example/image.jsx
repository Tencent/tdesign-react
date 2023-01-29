import React, { useRef, useState } from 'react';
import { Upload, Space, MessagePlugin, Checkbox, Button } from 'tdesign-react';
import { getFileUrlByFileRaw } from 'tdesign-react/_common/js/upload/utils';

export default function UploadExample() {
  const uploadRef1 = useRef();
  const uploadRef2 = useRef();
  const uploadRef3 = useRef();
  const [files1, setFiles1] = useState([]);
  const [files2, setFiles2] = useState([
    {
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      name: 'default.jpeg',
      status: 'success',
    },
  ]);
  const [files3, setFiles3] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [uploadInOneRequest, setUploadInOneRequest] = useState(false);
  const [autoUpload, setAutoUpload] = useState(true);

  const setFormattedUrlFiles = (files) => {
    const list = files.map(file => new Promise((resolve) => {
      getFileUrlByFileRaw(file.raw).then((url) => {
        resolve({ ...file, url  })
      });
    }))
    Promise.all(list).then((files) => {
      setFiles3(files);
    });
  };

  // 因上传请求始终返回固定的 url，为了让预览效果更加真实，故而将图片转为 base64 进行预览
  const onSuccess = ({ currentFiles }) => {
    const files = autoUpload ? files3.concat(currentFiles) : currentFiles;
    setFormattedUrlFiles(files);
  };

  // 有文件数量超出时会触发，文件大小超出限制、文件同名时会触发等场景。注意如果设置允许上传同名文件，则此事件不会触发
  const onValidate = (params) => {
    const { files, type } = params;
    console.log('onValidate', params);
    if (type === 'FILE_OVER_SIZE_LIMIT') {
      files.map((t) => t.name).join('、');
      MessagePlugin.warning(`${files.map((t) => t.name).join('、')} 等图片大小超出限制，已自动过滤`, 5000);
    } else if (type === 'FILES_OVER_LENGTH_LIMIT') {
      MessagePlugin.warning('文件数量超出限制，仅上传未超出数量的文件');
    } else if (type === 'FILTER_FILE_SAME_NAME') {
      // 如果希望支持上传同名图片，请设置 allowUploadDuplicateFile={true}
      MessagePlugin.warning('不允许上传同名图片');
    }
  };

  const uploadFiles = () => {
    uploadRef1.current.uploadFiles();
    uploadRef2.current.uploadFiles();
    uploadRef3.current.uploadFiles();
  };

  const onPreview = (params) => {
    console.log('点击图片预览时触发', params);
  };

  const formatResponse = () => {
    return { name: 'FileName', error: '网络异常，图片上传失败' };
  };

  return (
    <Space direction="vertical">

      <Space>
        <Checkbox checked={disabled} onChange={setDisabled}>
          禁用状态
        </Checkbox>
        <Checkbox checked={uploadInOneRequest} onChange={setUploadInOneRequest}>
          多个文件一个请求上传
        </Checkbox>
        <Checkbox checked={autoUpload} onChange={setAutoUpload}>
          自动上传
        </Checkbox>
        {!autoUpload && (
          <Button variant="base" theme="default" size="small" style={{ height: '22px' }} onClick={uploadFiles}>
            点击上传
          </Button>
        )}
      </Space>

      <br/>
      <Space direction='vertical'>
        <Space>
          <Upload
            ref={uploadRef1}
            files={files1}
            onChange={setFiles1}
            action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image"
            tips="请选择单张图片文件上传（上传成功状态演示）"
            accept="image/*"
            disabled={disabled}
            locale={{
              triggerUploadText: {
                image: '请选择图片',
              },
            }}
            autoUpload={autoUpload}
            formatResponse={() => ({
                url: "https://tdesign.gtimg.com/demo/demo-image-1.png"
            })}
          />

          <Upload
            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image"
            tips="单张图片文件上传（上传失败状态演示）"
            accept="image/*"
            formatResponse={formatResponse}
          />
        </Space>

        <Upload
          ref={uploadRef2}
          files={files2}
          onChange={setFiles2}
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          theme="image"
          accept="image/*"
          disabled={disabled}
          autoUpload={autoUpload}
        />

        <Upload
          ref={uploadRef3}
          files={files3}
          onChange={setFiles3}
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          theme="image"
          tips="允许选择多张图片文件上传，最多只能上传 3 张图片"
          accept="image/*"
          multiple
          max={3}
          disabled={disabled}
          sizeLimit={{ size: 2, unit: 'MB' }}
          autoUpload={autoUpload}
          abridgeName={[6, 6]}
          uploadAllFilesInOneRequest={uploadInOneRequest}
          onSuccess={onSuccess}
          onValidate={onValidate}
          onPreview={onPreview}
        />
      </Space>
    </Space>
  );
}
