import React, { useCallback, useState } from 'react';
import { Button, message, Upload, Space, UploadProps, UploadFile } from 'tdesign-react';
import { CloudUploadIcon } from 'tdesign-icons-react';

import type { UploadRef } from 'tdesign-react/upload/interface';

export default function CustomDrag() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const uploadDom = React.useRef<UploadRef>();

  const handleChange = useCallback((files) => {
    setFiles(files.slice(-1));
  }, []);
  const handleFail = useCallback(({ file }) => {
    message.error(`文件 ${file.name} 上传失败`);
  }, []);
  const handleSuccess = useCallback(({ file }) => {
    message.success(`文件 ${file.name} 上传成功`);
  }, []);
  const upload = useCallback(() => {
    uploadDom.current.triggerUpload();
  }, [uploadDom]);
  const onProgress = useCallback((val) => {
    setProgress(val);
  }, []);
  const customDraggerRender: UploadProps['dragContent'] = useCallback(
    (triggerContext) => {
      const { dragActive } = triggerContext;
      function renderCustomDrag() {
        if (dragActive) {
          return <p>释放鼠标</p>;
        }
        return progress < 1 ? <Button>自定义拖拽区域</Button> : null;
      }

      function renderFiles(files: UploadFile[]) {
        return (
          <ul style={{ padding: '0' }}>
            {files.map((file) => (
              <li key={file.name} style={{ listStyleType: 'none' }}>
                {file.name}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <>
          {files?.length ? renderFiles(files) : renderCustomDrag()}
          {files?.length > 0 && (
            <Button variant="base" style={{ marginTop: '16px' }}>
              更换文件
            </Button>
          )}
          <br />
          <br />
        </>
      );
    },
    [files, progress],
  );
  return (
    <Space direction="vertical">
      <Button variant="outline" icon={<CloudUploadIcon />} onClick={upload}>
        点击上传
      </Button>
      <Upload
        ref={uploadDom}
        files={files}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        draggable
        theme="custom"
        dragContent={customDraggerRender}
        onChange={handleChange}
        // onTrigger={handleChange}
        onFail={handleFail}
        onSuccess={handleSuccess}
        onProgress={onProgress}
      />
    </Space>
  );
}
