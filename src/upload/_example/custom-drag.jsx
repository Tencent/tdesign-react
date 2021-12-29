import React, { useCallback, useState } from 'react';
import { Button, message, Upload } from 'tdesign-react';
import { CloudUploadIcon } from 'tdesign-icons-react';

export default function CustomDrag() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const uploadDom = React.createRef();

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
  const customDraggerRender = useCallback(
    ({ dragActive }) => {
      function renderCustomDrag() {
        if (dragActive) {
          return <p>释放鼠标</p>;
        }
        return progress < 1 ? <Button>自定义拖拽区域</Button> : null;
      }

      function renderFiles(files) {
        return (
          <ul>
            {files.map((file) => (
              <li key={file.name}>{file.name}</li>
            ))}
          </ul>
        );
      }

      return (
        <>
          {files?.length ? renderFiles(files) : renderCustomDrag()}
          {files?.length > 0 && (
            <Button variant="base" style={{ marginTop: '36px' }}>
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
    <div className="tdesign-demo-upload t-upload">
      <Button variant="outline" onClick={upload}>
        <CloudUploadIcon />
        点击上传
      </Button>
      <br />
      <br />
      <Upload
        ref={uploadDom}
        files={files}
        action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        draggable
        theme="custom"
        customDraggerRender={customDraggerRender}
        onChange={handleChange}
        onTrigger={handleChange}
        onFail={handleFail}
        onSuccess={handleSuccess}
        onProgress={onProgress}
      />
    </div>
  );
}
