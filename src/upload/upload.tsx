import React, { ChangeEvent, useRef, useState, useCallback, useMemo } from 'react';
import isEmpty from 'lodash/isEmpty';
import Dragger from './dragger';
import UploadTrigger from './upload-trigger';
import Tips from './tips';
import request from '../_common/js/upload/xhr';
import useConfig from '../_util/useConfig';
import SingleFile from './themes/single-file';
import ImageCard from './themes/image-card';
import { finishUpload, updateFileList, isSingleFile } from './util';
import { TdUploadFile, UploadProps } from './types';
import { ProgressContext, SuccessContext, TdUploadProps, UploadRemoveContext } from './type';
import useDefaultValue from './hooks/useDefaultValue';

const urlCreator = window.webkitURL || window.URL;

const Upload: React.ForwardRefRenderFunction<unknown, UploadProps> = (props, ref) => {
  const {
    disabled,
    multiple,
    accept,
    draggable,
    placeholder,
    theme = 'file',
    max = 0,
    name = 'file',
    action,
    tips,
    format,
    data,
    headers,
    withCredentials,
    autoUpload = true,
    formatResponse,
    beforeUpload,
    onProgress,
    onChange,
    onSuccess,
    onFail,
    onRemove,
    onDragenter,
    onDragleave,
    files: fileList = [],
  } = useDefaultValue<Array<TdUploadFile>, UploadProps>(props, []);

  const { classPrefix } = useConfig();
  const uploadRef = useRef<HTMLInputElement>();
  const [errorMsg, setErrorMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const triggerUpload = () => {
    if (disabled) return;
    uploadRef?.current.click();
  };

  const getLimitedFiles = (files: Array<TdUploadFile> = []) => {
    const isSingleMode = isSingleFile(multiple, theme);
    const mergedLen = files.length + fileList.length;

    if (isSingleMode) {
      return files.splice(0, 1);
    }

    // 限制了最大张数
    if (max > 0) {
      const limitedFiles = mergedLen > max ? files.slice(0, max - fileList.length) : files;
      return fileList.concat(limitedFiles);
    }

    return fileList.concat(files);
  };

  const onError = useCallback(
    (options: { event: ProgressEvent; file: TdUploadFile; response?: any }) => {
      const { event, file, response } = options;
      file.status = 'fail';
      let res = response;
      if (typeof formatResponse === 'function') {
        res = formatResponse(response, { file });
      }

      setErrorMsg(res?.error || '上传失败');
      const context = { e: event, file };
      const nextFileList = updateFileList(file, fileList);
      // setFileList((prevFileList) => updateFileList(file, prevFileList));
      onChange?.(nextFileList, { trigger: 'upload fail' });
      onFail?.(context);
    },
    [fileList, formatResponse, onChange, onFail],
  );

  const singleDraggable = useMemo(
    () => !multiple && draggable && ['file', 'file-input', 'image'].includes(theme),
    [draggable, multiple, theme],
  );

  const handleSingleRemove = (e) => {
    const changeCtx = { trigger: 'remove' };
    // setFileList([]);
    setErrorMsg('');
    onChange?.([], changeCtx);
    onRemove?.({ e });
  };

  const handleSuccess = useCallback(
    ({ e, file: tmpFile, response }: SuccessContext) => {
      const file = tmpFile;
      file.status = 'success';
      file.url = response.url || file.url;
      const context = { e, response, trigger: 'upload-success' };
      const nextFileList = updateFileList(file, fileList);
      const sContext = {
        file,
        fileList: nextFileList,
        e,
        response,
      };
      // setFileList((prevFileList) => updateFileList(file, prevFileList));
      onChange?.(nextFileList, context);
      onSuccess?.(sContext);
    },
    [fileList, onChange, onSuccess],
  );

  const handleProgress = useCallback(
    ({ e, file, percent, type = 'mock' }: ProgressContext) => {
      const tmpFile = { ...file };
      tmpFile.percent = percent;
      const progressCtx = { percent, e, file: tmpFile, type };
      const nextFileList = updateFileList(tmpFile, fileList);
      // setFileList((prevFileList) => updateFileList(tmpFile, prevFileList));
      onChange?.(nextFileList, { trigger: 'progress' });
      onProgress?.(progressCtx);
    },
    [fileList, onChange, onProgress],
  );

  const upload = useCallback(
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

  const formatFiles = (files: File[] = []): TdUploadFile[] =>
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
    });

  const handleBeforeUpload = (file: TdUploadFile): Promise<boolean> => {
    if (typeof beforeUpload === 'function') {
      const r = beforeUpload(file);
      if (r instanceof Promise) return r;
      return new Promise((resolve) => resolve(r));
    }
    return new Promise((resolve) => resolve(true));
  };

  const uploadFiles = () => {
    fileList.forEach((uploadFile) => {
      handleBeforeUpload(uploadFile).then((canUpload) => {
        if (!canUpload) return;
        if (autoUpload) {
          upload(uploadFile);
        }
      });
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const { files } = event.target;
    let tmpFiles = Array.from(files);
    const uploadList = formatFiles(tmpFiles);
    tmpFiles = getLimitedFiles(uploadList);
    // setFileList(() => tmpFiles);
    setUploading(true);
    uploadRef.current.value = '';
    onChange?.(tmpFiles, { trigger: 'upload' });
  };

  const handleDragChange = (files: FileList): void => {
    if (disabled) return;
    let tmpFiles = Array.from(files);
    const uploadList = formatFiles(tmpFiles);
    tmpFiles = getLimitedFiles(uploadList);
    setUploading(true);
    onChange?.(tmpFiles, { trigger: 'drag' });
  };

  const handleDragenter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      onDragenter?.({ e });
    },
    [disabled, onDragenter],
  );

  const handleDragleave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      onDragleave?.({ e });
    },
    [disabled, onDragleave],
  );

  // TODO
  const cancelUpload = useCallback(() => {
    if (!fileList[0]) {
      urlCreator?.revokeObjectURL(fileList[0].url);
    }
    uploadRef.current.value = '';
  }, [fileList]);

  const showUploadList = useMemo(() => multiple && ['file-flow', 'image-flow'].includes(theme), [theme, multiple]);

  const showErrorMsg = useMemo(() => !showUploadList && !!errorMsg, [errorMsg, showUploadList]);

  const showTips = useMemo(() => {
    if (theme === 'file') {
      const noFile = isEmpty(fileList);
      return tips && noFile;
    }
    return Boolean(tips);
  }, [fileList, theme, tips]);

  const handleMultipleRemove = (options: UploadRemoveContext) => {
    const files = fileList.concat();
    files.splice(options.index, 1);
    onChange?.(files, { trigger: 'remove' });
    onRemove?.(options);
  };

  React.useEffect(() => {
    if (uploading) {
      uploadFiles();
    }
    // eslint-disable-next-line
  }, [uploading]);

  useMemo(() => {
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
        <ImageCard
          multiple={multiple}
          max={max}
          onRemove={handleMultipleRemove}
          onTrigger={triggerUpload}
          files={fileList}
        />
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
