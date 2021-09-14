import React, { ChangeEvent, useRef, useState } from 'react';
import Dragger from './dragger';
import UploadTrigger from './upload-trigger';
import Tips from './tips';
import request from './utils/request';
import useConfig from '../_util/useConfig';
import SingleFile from './themes/single-file';
import ImageCard from './themes/image-card';
import { finishUpload, updateFileList } from './util';
import { TdUploadFile } from './types';
import { ProgressContext, SuccessContext, TdUploadProps, UploadRemoveContext } from '../_type/components/upload';

const urlCreator = window.webkitURL || window.URL;

const Upload: React.ForwardRefRenderFunction<unknown, TdUploadProps> = (props, ref) => {
  const {
    disabled,
    multiple,
    accept,
    draggable,
    placeholder,
    theme = 'file',
    max = 0,
    action,
    tips,
    format,
    data,
    headers,
    withCredentials,
    autoUpload = true,
    formatResponse,
    onProgress,
    onChange,
    onSuccess,
    onFail,
    onRemove,
    onDragenter,
    onDragleave,
  } = props;

  const { classPrefix } = useConfig();
  const uploadRef = useRef<HTMLInputElement>();
  const [fileList, setFileList] = useState<TdUploadFile[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const triggerUpload = () => {
    if (disabled) return;
    uploadRef?.current.click();
  };

  const getLimitedFiles = React.useCallback(
    (files: Array<TdUploadFile> = []) => {
      const mergedFiles = fileList.concat(files);
      return mergedFiles.slice(0, max || mergedFiles.length);
    },
    [max, fileList],
  );

  const onError = React.useCallback(
    (options: { event: ProgressEvent; file: TdUploadFile; response?: any }) => {
      const { event, file, response } = options;
      file.status = 'fail';
      let res = response;
      if (typeof formatResponse === 'function') {
        res = formatResponse(response);
      }

      setErrorMsg(res?.error || '上传失败');
      const context = { e: event, file };
      setFileList(updateFileList(file, fileList));
      onFail?.(context);
    },
    [fileList, formatResponse, onFail],
  );

  const singleDraggable = React.useMemo(
    () => !multiple && draggable && ['file', 'file-input', 'image'].includes(theme),
    [draggable, multiple, theme],
  );

  const handleSingleRemove = (e) => {
    const changeCtx = { trigger: 'remove' };
    setFileList([]);
    setErrorMsg('');
    onChange?.([], changeCtx);
    onRemove?.({ e });
  };

  const handleSuccess = React.useCallback(
    ({ e, file: tmpFile, response }: SuccessContext) => {
      const file = tmpFile;
      file.status = 'success';
      file.url = response.url || file.url;
      // 上传成功的文件发送到 files
      const newFile: TdUploadFile = { ...file, response };
      const tmpFiles = multiple ? fileList.concat(newFile) : [newFile];
      const context = { e, response, trigger: 'upload-success' };
      const sContext = {
        file,
        fileList: tmpFiles,
        e,
        response,
      };

      const nextFileList = updateFileList(file, fileList);
      setFileList(nextFileList);
      onChange?.(tmpFiles, context);
      onSuccess?.(sContext);
    },
    [fileList, multiple, onChange, onSuccess],
  );

  const handleProgress = React.useCallback(
    ({ e, file, percent }: ProgressContext) => {
      const tmpFile = { ...file };
      tmpFile.percent = percent;
      const progressCtx = { percent, e, file: tmpFile };
      const nextFileList = updateFileList(tmpFile as TdUploadFile, fileList);
      setFileList(nextFileList);
      onProgress?.(progressCtx);
    },
    [fileList, onProgress],
  );

  const upload = React.useCallback(
    (uploadFile: TdUploadFile): Promise<void> => {
      const file = { ...uploadFile };
      if (file.status !== 'waiting') {
        return;
      }
      if (!action) {
        console.error('TDesign Upload Error: action is required.');
        return;
      }
      setErrorMsg('');
      // eslint-disable-next-line no-param-reassign
      file.status = 'progress';
      request({
        action,
        data,
        file,
        name: 'file',
        onError,
        headers,
        withCredentials,
        onProgress: handleProgress,
        onSuccess: handleSuccess,
      });
    },
    [action, data, handleProgress, handleSuccess, headers, onError, withCredentials],
  );

  const formatFiles = React.useCallback(
    (files: File[] = []): TdUploadFile[] =>
      files.map((fileRaw) => {
        const file = typeof format === 'function' ? format(fileRaw) : fileRaw;
        const uploadFile: TdUploadFile = {
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
        return uploadFile;
      }),
    [format],
  );

  const uploadFiles = React.useCallback(() => {
    fileList.forEach((uploadFile) => {
      if (autoUpload) {
        upload(uploadFile);
      }
    });
  }, [autoUpload, upload, fileList]);

  const handleChange = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const { files } = event.target;
      let tmpFiles = [...files];
      // 最大限制
      const uploadList = formatFiles(tmpFiles);
      tmpFiles = getLimitedFiles(uploadList);
      setFileList(tmpFiles);
      setUploading(true);
      // uploadFiles();
      uploadRef.current.value = '';
    },
    [disabled, formatFiles, getLimitedFiles],
  );

  const handleDragChange = React.useCallback(
    (files: FileList): void => {
      if (disabled) return;
      let tmpFiles = [...files];
      const uploadList = formatFiles(tmpFiles);
      tmpFiles = getLimitedFiles(uploadList);
      setFileList(tmpFiles);
      setUploading(true);
      // uploadFiles();
    },
    [disabled, formatFiles, getLimitedFiles],
  );

  const handleDragenter = React.useCallback(
    (e: DragEvent) => {
      if (disabled) return;
      onDragenter?.({ e });
    },
    [disabled, onDragenter],
  );

  const handleDragleave = React.useCallback(
    (e: DragEvent) => {
      if (disabled) return;
      onDragleave?.({ e });
    },
    [disabled, onDragleave],
  );

  const cancelUpload = React.useCallback(() => {
    if (!fileList[0]) {
      urlCreator?.revokeObjectURL(fileList[0].url);
    }
    uploadRef.current.value = '';
  }, [fileList]);

  const showUploadList = React.useMemo(
    () => multiple && ['file-flow', 'image-flow'].includes(theme),
    [theme, multiple],
  );

  const showErrorMsg = React.useMemo(() => !showUploadList && !!errorMsg, [errorMsg, showUploadList]);

  const showTips = React.useMemo(() => {
    if (theme === 'file') {
      const noFile = !fileList || !fileList.length;
      return tips && noFile;
    }
    return Boolean(tips);
  }, [fileList, theme, tips]);

  const handleMultipleRemove = (options: UploadRemoveContext) => {
    const files = fileList.concat();
    files.splice(options.index, 1);
    setFileList(files);
    onRemove?.(options);
  };

  React.useEffect(() => {
    if (uploading) {
      uploadFiles();
    }
    // eslint-disable-next-line
  }, [uploading]);

  React.useMemo(() => {
    const timestamp = Date.now();
    (fileList || []).forEach((file, index) => {
      if (!file.uid && !Object.isFrozen(file)) {
        // eslint-disable-next-line no-param-reassign
        file.uid = `td__upload__${timestamp}_${index}__`;
      }
    });
    const finish = fileList.every((file) => finishUpload(file.status));
    setUploading(!finish);
  }, [fileList]);

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
          file={fileList && fileList[0]}
          display={theme}
          placeholder={placeholder}
          onRemove={handleSingleRemove}
        >
          <UploadTrigger onClick={triggerUpload} />
        </SingleFile>
      )}
      {!draggable && theme === 'image' && (
        <ImageCard max={max} onRemove={handleMultipleRemove} onTrigger={triggerUpload} files={fileList} />
      )}
      {singleDraggable && (
        <Dragger
          onChange={handleDragChange}
          onDragenter={handleDragenter}
          onDragleave={handleDragleave}
          file={fileList && fileList[0]}
          display={theme}
          onCancel={cancelUpload}
          onRemove={handleSingleRemove}
          onUpload={(file) => {
            upload(file);
          }}
          onTrigger={triggerUpload}
        />
      )}
      {!errorMsg && showTips && <Tips>{tips}</Tips>}
      {showErrorMsg && <Tips type="error">{errorMsg}</Tips>}
    </div>
  );
};

export default React.forwardRef<unknown, TdUploadProps>(Upload);
