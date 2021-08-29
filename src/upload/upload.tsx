import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import findIndex from 'lodash/findIndex';
import useConfig from '../_util/useConfig';
import { UploadFile, TdUploadProps, ProgressContext, SuccessContext } from '../_type/components/upload';
import Dragger from './dragger';
import UploadTrigger from './upload-trigger';
import request from './utils/request';
import Tips from './tips';
import SingleFile from './single-file';

const urlCreator = window.webkitURL || window.URL;

const Upload: React.ForwardRefRenderFunction<unknown, TdUploadProps> = (props, ref) => {
  const {
    accept,
    disabled = false,
    multiple,
    tips,
    max,
    beforeUpload,
    format,
    autoUpload = true,
    action,
    name,
    headers,
    data,
    withCredentials,
    onProgress,
    onChange,
    onSuccess,
    onFail,
    onRemove,
    onDragenter,
    onDragleave,
    draggable = false,
    theme = 'file',
    placeholder = '',
  } = props;
  const { classPrefix } = useConfig();
  const uploadRef = useRef<HTMLInputElement>();
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingFile, setLoadingFile] = useState<UploadFile>(null);
  const [toUploadFiles, setToUploadFiles] = useState([]);
  const [files, setFiles] = useState<File[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [, setDragActive] = useState(false);

  const handleBeforeUpload = useCallback(
    (file: File | UploadFile): Promise<boolean> => {
      if (typeof beforeUpload === 'function') {
        const r = beforeUpload(file);
        if (r instanceof Promise) return r;
        return new Promise((resolve) => resolve(r));
      }
      return new Promise((resolve) => resolve(true));
    },
    [beforeUpload],
  );

  const handleProgress = React.useCallback(
    ({ e, file, percent }: ProgressContext) => {
      const tmpFile = { ...file };
      tmpFile.percent = percent;
      setLoadingFile(tmpFile);
      const progressCtx = { percent, e, file: tmpFile };
      onProgress?.(progressCtx);
    },
    [onProgress],
  );

  const handleSuccess = React.useCallback(
    ({ e, file: tmpFile, response }: SuccessContext) => {
      const file = tmpFile;
      file.status = 'success';
      file.url = response.url || file.url;
      const index = findIndex(this.toUploadFiles, (o: File) => o.name === file.name);
      setToUploadFiles(toUploadFiles.splice(index, 1));
      // 上传成功的文件发送到 files
      const newFile: UploadFile = { ...file, response };
      const files = this.multiple ? this.files.concat(newFile) : [newFile];
      const context = { e, response, trigger: 'upload-success' };
      this.emitChangeEvent(files, context);
      onChange?.(files, context);
      const sContext = {
        file,
        fileList: files,
        e,
        response,
      };
      onSuccess?.(sContext);
      setLoadingFile(null);
    },
    [onChange, onSuccess, toUploadFiles],
  );

  const onError = React.useCallback(
    (options: { event: ProgressEvent; file: UploadFile; response?: any }) => {
      const { event, file, response } = options;
      file.status = 'fail';
      setLoadingFile(file);
      let res = response;
      if (typeof props.formatResponse === 'function') {
        res = props.formatResponse(response);
      }
      setErrorMsg((res && res.error) ?? '上传失败');
      const context = { e: event, file };
      onFail?.(context);
    },
    [onFail, props],
  );

  const upload = useCallback(
    (uploadFile: UploadFile): Promise<void> => {
      const file = { ...uploadFile };
      if (!action) {
        console.error('TDesign Upload Error: action is required.');
        return;
      }
      setErrorMsg('');
      file.status = 'progress';
      // 模拟进度条
      const timer = setInterval(() => {
        file.percent += 1;
        if (file.percent >= 99) {
          clearInterval(timer);
        }
      }, 10);
      setLoadingFile(file);
      request({
        action,
        data,
        file,
        name,
        onError,
        headers,
        withCredentials,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
      });
    },
    [action, data, handleProgress, handleSuccess, headers, name, onError, withCredentials],
  );

  const uploadFiles = useCallback(
    (uploadFiles: FileList) => {
      const files = Array.from(uploadFiles);
      const tmpFiles = [...files].slice(0, max ? max - files.length : files.length);

      if (tmpFiles.length !== files.length) {
        console.warn(`TDesign Upload Warn: you can only upload ${max} files`);
      }

      tmpFiles.forEach((fileRaw: File) => {
        const file = typeof format === 'function' ? format(fileRaw) : fileRaw;
        const uploadFile: UploadFile = {
          raw: fileRaw,
          lastModified: fileRaw.lastModified,
          name: fileRaw.name,
          size: fileRaw.size,
          type: fileRaw.type,
          percent: 0,
          status: 'waiting',
          ...file,
        };
        uploadFile.url = urlCreator.createObjectURL(fileRaw);
        handleBeforeUpload(file).then((canUpload) => {
          if (!canUpload) return;
          const newFiles = toUploadFiles.concat();
          newFiles.push(uploadFile);
          setToUploadFiles([...new Set(newFiles)]);
          setLoadingFile(uploadFile);
          if (autoUpload) {
            upload(uploadFile);
          }
        });
      });
    },
    [max, format, handleBeforeUpload, toUploadFiles, autoUpload, upload],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const { files } = event.target;
      setFiles(Array.from(files));
      uploadFiles(files);
      uploadRef?.current.setAttribute('value', '');
    },
    [disabled, uploadFiles],
  );

  const triggerUpload = useCallback(() => {
    if (disabled) return;
    uploadRef?.current.click();
  }, [disabled]);

  const handleSingleRemove = React.useCallback(
    (e) => {
      const changeCtx = { trigger: 'remove' };
      onChange?.([], changeCtx);
      onRemove?.({ e });
    },
    [onChange, onRemove],
  );

  const handleDragChange = React.useCallback(
    (files: FileList): void => {
      if (disabled) return;
      uploadFiles(files);
    },
    [disabled, uploadFiles],
  );

  const handleDragenter = React.useCallback(
    (e: DragEvent) => {
      if (disabled) return;
      setDragActive(true);
      onDragenter?.({ e });
    },
    [disabled, onDragenter],
  );

  const handleDragleave = React.useCallback(
    (e: DragEvent) => {
      if (this.disabled) return;
      setDragActive(false);
      onDragleave?.({ e });
    },
    [onDragleave],
  );

  const cancelUpload = React.useCallback(() => {
    if (!files[0] && loadingFile) {
      urlCreator?.revokeObjectURL(loadingFile.url);
      setLoadingFile(null);
    }
    uploadRef.current.value = '';
  }, [files, loadingFile]);

  const renderDraggerTrigger = React.useCallback(
    () => (
      <Dragger
        onChange={handleDragChange}
        onDragenter={handleDragenter}
        onDragleave={handleDragleave}
        loadingFile={loadingFile}
        file={files && files[0]}
        display={theme}
        onCancel={cancelUpload}
        onRemove={handleSingleRemove}
        onUpload={upload}
        onTrigger={triggerUpload}
      />
    ),
    [
      cancelUpload,
      files,
      handleDragChange,
      handleDragenter,
      handleDragleave,
      handleSingleRemove,
      loadingFile,
      theme,
      triggerUpload,
      upload,
    ],
  );

  const showUploadList = React.useMemo(
    () => multiple && ['file-flow', 'image-flow'].includes(theme),
    [theme, multiple],
  );

  const showTips = React.useMemo(() => {
    if (theme === 'file') {
      const noFile = (!files || !files.length) && !loadingFile;
      return tips && noFile;
    }
    return Boolean(tips);
  }, [files, loadingFile, theme, tips]);

  const showErrorMsg = React.useMemo(() => !showUploadList && !!errorMsg, [errorMsg, showUploadList]);

  const singleDraggable = React.useMemo(
    () => !multiple && draggable && ['file', 'file-input', 'image'].includes(theme),
    [draggable, multiple, theme],
  );

  React.useImperativeHandle(ref, () => ({
    upload: uploadRef.current,
  }));

  return (
    <div className={`${classPrefix}-upload`}>
      <input
        ref={uploadRef}
        type="file"
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        hidden
        onChange={handleChange}
      />
      {!draggable && ['file', 'file-input'].includes(theme) && (
        <SingleFile
          file={files && files[0]}
          loadingFile={loadingFile}
          display={theme}
          onRemove={handleSingleRemove}
          placeholder={placeholder}
        >
          <UploadTrigger onClick={triggerUpload} />
        </SingleFile>
      )}
      {singleDraggable && renderDraggerTrigger()}
      {!errorMsg && showTips && <Tips>{tips}</Tips>}
      {showErrorMsg && <Tips type="error">{errorMsg}</Tips>}
    </div>
  );
};

export default React.forwardRef(Upload);
